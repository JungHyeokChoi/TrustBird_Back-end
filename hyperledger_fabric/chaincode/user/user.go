package main

import (
	"encoding/json"
	"fmt"

	"github.com/hyperledger/fabric/core/chaincode/shim"
	sc "github.com/hyperledger/fabric/protos/peer"
)

type SmartContract struct {
}

type User struct {
	Username string `json:"username"`
	Email string `json:"email"`
	Password string `json:"password"`
	DateOfBirth string `json:"dateofbirth"`
	Gender string `json:"gender"`
	TelephoneNum string `json:"telephonenum"`
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
	}

	return shim.Error("Invalid Smart Contract function name.")
}

func  (s *SmartContract) addUser(APIstub shim.ChaincodeStubInterface, args []string) sc.Response {
	if len(args) != 6 {
		return shim.Error("fail!")
	}

	var user = User{
		Username : args[0],
		Email : args[1],
		Password : args[2],
		DateOfBirth : args[3],
		Gender : args[4],
		TelephoneNum : args[5]}

	userAsBytes, _ := json.Marshal(user)
	APIstub.PutState(args[1], userAsBytes)

	return shim.Success(nil)
}

func  (s *SmartContract) updateUser(APIstub shim.ChaincodeStubInterface, args []string) sc.Response {
	if len(args) != 6 {
		return shim.Error("fail!")
	}

	userAsBytes, _ := APIstub.GetState(args[1])
	user := User{}

	json.Unmarshal(userAsBytes, &user)
	user = User{
		Username : args[0],
		Email : args[1],
		Password : args[2],
		DateOfBirth : args[3],
		Gender : args[4],
		TelephoneNum : args[5]}

	userAsBytes, _ = json.Marshal(user)
	APIstub.PutState(args[1], userAsBytes)

	return shim.Success(nil)
}

func  (s *SmartContract) removeUser(APIstub shim.ChaincodeStubInterface, args []string) sc.Response {
	if len(args) != 1 {
		return shim.Error("fail!")
	}

	err := APIstub.DelState(args[0])

	if err != nil {
		return shim.Error("Fail Delete")
	}

	return shim.Success(nil)
}

func  (s *SmartContract) readUser(APIstub shim.ChaincodeStubInterface, args []string) sc.Response {
	if len(args) != 1 {
		return shim.Error("fail!")
	}

	userAsBytes, _ := APIstub.GetState(args[0])
	
	return shim.Success(userAsBytes)
}

func main() {
	err := shim.Start(new(SmartContract))
	if err != nil {
		fmt.Printf("Error creating new Smart Contract : %s", err)
	}
}