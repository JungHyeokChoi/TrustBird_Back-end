package main

import (
	"bytes"
	"encoding/json"
	"fmt"
	"reflect"

	"github.com/hyperledger/fabric/core/chaincode/shim"
	sc "github.com/hyperledger/fabric/protos/peer"
)

type SmartContract struct {
}

type User struct {
	Username string `json:"username"`
	Email string `json:"email"`
	Password string `json:"password"`
	DateOfBirth string `json:"dateOfBirth"`
	Gender string `json:"gender"`
	TelephoneNum string `json:"telephoneNum"`
	Permission string `json:"permission"`
	Membership string `json:"membership"`
	Balance string `json:"balance"`
	Trust []string `json:"trust"`
	MaintenanceFee []string `json:"maintenanceFee"`
}

func (s *SmartContract) Init(APIstub shim.ChaincodeStubInterface) sc.Response {
	return shim.Success(nil)
}

func (s *SmartContract) Invoke(APIstub shim.ChaincodeStubInterface) sc.Response {
	function, args := APIstub.GetFunctionAndParameters()

	if function == "addUser" {
		return s.addUser(APIstub, args)
	} else if function == "updateUser" {
		return s.updateUser(APIstub, args)
	} else if function == "removeUser" {
		return s.removeUser(APIstub, args)
	} else if function == "readUser" {
		return s.readUser(APIstub, args)
	} else if function == "readAllUser" {
		return s.readAllUser(APIstub)
	} else if function == "addAttribute" {
		return s.addAttribute(APIstub, args)
	} else if function == "updateAttribute" {
		return s.updateAttribute(APIstub, args)
	} else if function == "removeAttribute" {
		return s.removeAttribute(APIstub, args)
	} else if function == "readAttribute" {
		return s.readAttribute(APIstub, args)
	}

	return shim.Error("Invalid Smart Contract function name.")
}

func (s *SmartContract) addUser(APIstub shim.ChaincodeStubInterface, args []string) sc.Response {
	if len(args) != 9 {
		return shim.Error("fail!")
	}

	var user = User{
		Username : args[0],
		Email : args[1],
		Password : args[2],
		DateOfBirth : args[3],
		Gender : args[4],
		TelephoneNum : args[5],
		Permission : args[6],
		Membership : args[7],
		Balance : args[8]}

	userAsBytes, _ := json.Marshal(user)
	APIstub.PutState(args[1], userAsBytes)

	return shim.Success(nil)
}

func (s *SmartContract) updateUser(APIstub shim.ChaincodeStubInterface, args []string) sc.Response {
	if len(args) != 9 {
		return shim.Error("fail!")
	}

	userAsBytes, _ := APIstub.GetState(args[1])
	if(userAsBytes == nil) {
		return shim.Error("This user is not exist. Update fail")
	}
	
	user := User{}

	json.Unmarshal(userAsBytes, &user)
	user = User{
		Username : args[0],
		Email : args[1],
		Password : args[2],
		DateOfBirth : args[3],
		Gender : args[4],
		TelephoneNum : args[5],
		Permission : args[6],
		Membership : args[7],
		Balance : args[8]}

	userAsBytes, _ = json.Marshal(user)
	APIstub.PutState(args[1], userAsBytes)

	return shim.Success(nil)
}

func (s *SmartContract) removeUser(APIstub shim.ChaincodeStubInterface, args []string) sc.Response {
	if len(args) != 1 {
		return shim.Error("fail!")
	}

	err := APIstub.DelState(args[0])

	if err != nil {
		return shim.Error("Fail Delete")
	}

	return shim.Success(nil)
}

func (s *SmartContract) readUser(APIstub shim.ChaincodeStubInterface, args []string) sc.Response {
	if len(args) != 1 {
		return shim.Error("fail!")
	}

	userAsBytes, _ := APIstub.GetState(args[0])
	
	return shim.Success(userAsBytes)
}

func (s *SmartContract) readAllUser(APIstub shim.ChaincodeStubInterface) sc.Response {
	startKey := ""
	endKey := ""

	resultsIterator, err := APIstub.GetStateByRange(startKey, endKey)
	if err != nil {
		return shim.Error(err.Error())
	}
	defer resultsIterator.Close()

	var buffer bytes.Buffer
	buffer.WriteString("[")

	bArrayMemberAlreadyWritten := false
	for resultsIterator.HasNext() {
		queryResponse, err := resultsIterator.Next()
		if err != nil {
			return shim.Error(err.Error())
		}
		if bArrayMemberAlreadyWritten == true {
			buffer.WriteString(",")
		}
		buffer.WriteString(string(queryResponse.Value))
		bArrayMemberAlreadyWritten = true
	}
	buffer.WriteString("]")

	return shim.Success(buffer.Bytes())
}

func (s *SmartContract) addAttribute(APIstub shim.ChaincodeStubInterface, args []string) sc.Response {
	if len(args) != 3 {
		return shim.Error("fail!")
	}

	userAsBytes, _ := APIstub.GetState(args[0])
	if(userAsBytes == nil) {
		return shim.Error("This user is not exist. Update fail")
	}
	
	user := User{}

	json.Unmarshal(userAsBytes, &user)

	field := reflect.ValueOf(&user).Elem().FieldByName(args[1])

	if field.Kind() == reflect.Slice {
		field.Set(reflect.Append(field, reflect.ValueOf(args[2])))
	} else {
		field.SetString(args[2])
	}

	userAsBytes, _ = json.Marshal(user)
	APIstub.PutState(args[0], userAsBytes)

	return shim.Success(nil)
}

func (s *SmartContract) updateAttribute(APIstub shim.ChaincodeStubInterface, args []string) sc.Response {
	if len(args) != 4 {
		return shim.Error("fail!")
	}

	userAsBytes, _ := APIstub.GetState(args[0])
	if(userAsBytes == nil) {
		return shim.Error("This user is not exist. Update fail")
	}

	preUser := User{}
	newUser := User{}

	json.Unmarshal(userAsBytes, &preUser)

	pPreUser := reflect.ValueOf(&preUser).Elem()
	pNewUser := reflect.ValueOf(&newUser).Elem()

	userType := reflect.TypeOf(User{})

	for i := 0; i < userType.NumField(); i++ {
		pPreUserField := pPreUser.Field(i)
		pNewUserField := pNewUser.Field(i)
		userTypeField := userType.Field(i)

		if userTypeField.Name == args[1] {
			if pPreUserField.Kind() == reflect.Slice {
				transfer := []string{}

				for j := 0; j < pPreUserField.Len(); j++ {
					if pPreUserField.Index(j).String() == args[2] {
						transfer = append(transfer, args[3])
					} else {
						transfer = append(transfer, pPreUserField.Index(j).String())
					}
				}
				pNewUserField.Set(reflect.ValueOf(transfer))

			} else {
				if pPreUserField.String() == args[2]{
					pNewUserField.SetString(args[3])
				}
			}
		} else {
			pNewUserField.Set(pPreUserField)
		}
	}
	userAsBytes, _ = json.Marshal(newUser)
	APIstub.PutState(args[0], userAsBytes)

	return shim.Success(nil)
}

func (s *SmartContract) removeAttribute(APIstub shim.ChaincodeStubInterface, args []string) sc.Response {
	if len(args) != 3 {
		return shim.Error("fail!")
	}

	userAsBytes, _ := APIstub.GetState(args[0])
	if(userAsBytes == nil) {
		return shim.Error("This user is not exist. Update fail")
	}
	
	preUser := User{}
	newUser := User{}

	json.Unmarshal(userAsBytes, &preUser)

	pPreUser := reflect.ValueOf(&preUser).Elem()
	pNewUser := reflect.ValueOf(&newUser).Elem()

	userType := reflect.TypeOf(User{})

	for i := 0; i < userType.NumField(); i++ {
		pPreUserField := pPreUser.Field(i)
		pNewUserField := pNewUser.Field(i)
		userTypeField := userType.Field(i)

		if userTypeField.Name == args[1] {
			if pPreUserField.Kind() == reflect.Slice {
				transfer := []string{}

				for j := 0; j < pPreUserField.Len(); j++ {
					if pPreUserField.Index(j).String() != args[2] {
						transfer = append(transfer, pPreUserField.Index(j).String())
					}
				}
				pNewUserField.Set(reflect.ValueOf(transfer))
			} else {
				if pPreUserField.String() == args[2]{
					pNewUserField.SetString("")
				}
			}
		} else {
			pNewUserField.Set(pPreUserField)
		}
	}
	userAsBytes, _ = json.Marshal(newUser)
	APIstub.PutState(args[0], userAsBytes)

	return shim.Success(nil)
}

func (s *SmartContract) readAttribute(APIstub shim.ChaincodeStubInterface, args []string) sc.Response {
	if len(args) != 2 {
		return shim.Error("fail!")
	}

	userAsBytes, _ := APIstub.GetState(args[0])
	user := User{}

	json.Unmarshal(userAsBytes, &user)

	field := reflect.ValueOf(user).FieldByName(args[1])

	if field.Kind() == reflect.Slice {
		transfer := []string{}

		for i := 0; i < field.Len(); i++ {
			transfer = append(transfer, field.Index(i).String())
		}

		fieldAsBytes, _ := json.Marshal(transfer)
		return shim.Success(fieldAsBytes)
	}
		
	fieldAsBytes, _ := json.Marshal(field.String())
	return shim.Success(fieldAsBytes)
}

func main() {
	err := shim.Start(new(SmartContract))
	if err != nil {
		fmt.Printf("Error creating new Smart Contract : %s", err)
	}
}