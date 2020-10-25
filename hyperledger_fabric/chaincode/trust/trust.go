package main

import (
	"bytes"
	"encoding/json"
	"fmt"

	"github.com/hyperledger/fabric/core/chaincode/shim"
	sc "github.com/hyperledger/fabric/protos/peer"
)

type SmartContract struct {
}

type Trust struct {
	Token string `json:"token"`
	PreToken string `json:"preToken"`
	Username string `json:"username"`
	TelephoneNum string `json:"telephoneNum"`
	RealtorName string `json:"realtorName"`
	RealtorTelephoneNum string `json:"realtorTelephoneNum"`
	RealtorCellphoneNum string `json:"realtorCellphoneNum"`
	Type string `json:"type"`
	SecurityDeposit string `json:"securityDeposit"`
	Rent string `json:"rent"`
	Purpose string `json:"purpose"`
	PeriodStart string `json:"periodStart"`
	PeriodEnd string `json:"periodEnd"`
	Etc string `json:"etc"`
	Status string `json:"status"`
	Contract string `json:"contract"`
	Attachments []Attachment `json:"attachments"`
}

type Attachment struct {
	Filename string `json:"fileName"`
	FilePath string `json:"filePath"`
}

func (s *SmartContract) Init(APIstub shim.ChaincodeStubInterface) sc.Response {
	return shim.Success(nil)
}

func (s *SmartContract) Invoke(APIstub shim.ChaincodeStubInterface) sc.Response {
	function, args := APIstub.GetFunctionAndParameters()

	if function == "addTrust" {
		return s.addTrust(APIstub, args)
	} else if function == "updateTrust" {
		return s.updateTrust(APIstub, args)
	}else if function == "removeTrust" {
		return s.removeTrust(APIstub, args)
	} else if function == "readTrust" {
		return s.readTrust(APIstub, args)
	} else if function == "readAllTrust" {
		return s.readAllTrust(APIstub)
	} else if function == "setStatus" {
		return s.setStatus(APIstub, args)
	} else if function == "readStatus" {
		return s.readStatus(APIstub, args)
	} else if function == "setContract" {
		return s.setContract(APIstub, args)
	}

	return shim.Error("Invalid Smart Contract function name.")
}

func  (s *SmartContract) addTrust(APIstub shim.ChaincodeStubInterface, args []string) sc.Response {
	if len(args) < 15 {
		return shim.Error("fail!")
	}

	var trust = Trust{
		Token : args[0],
		PreToken : args[1],
		Username : args[2],
		TelephoneNum : args[3],
		RealtorName : args[4],
		RealtorTelephoneNum : args[5],
		RealtorCellphoneNum : args[6],
		Type: args[7],
		SecurityDeposit : args[8],
		Rent : args[9],
		Purpose : args[10],
		PeriodStart : args[11],
		PeriodEnd : args[12],
		Etc : args[13],
		Status : args[14],
		Contract : args[15],
		Attachments : []Attachment{}}
	
	var Attachment = Attachment{}

	for i := 16; i < len(args); i+=2 {
		Attachment.Filename = args[i]
		Attachment.FilePath = args[i + 1]

		trust.Attachments = append(trust.Attachments, Attachment)
	}

	trustAsBytes, _ := json.Marshal(trust)
	APIstub.PutState(args[0], trustAsBytes)

	return shim.Success(nil)
}

func  (s *SmartContract) updateTrust(APIstub shim.ChaincodeStubInterface, args []string) sc.Response {
	if len(args) < 15 {
		return shim.Error("fail!")
	}

	trustAsBytes, _ := APIstub.GetState(args[1])
	if(trustAsBytes == nil) {
		return shim.Error("This trust is not exist. Update fail")
	}

	trust := Trust{}

	json.Unmarshal(trustAsBytes, &trust)
	
	err := APIstub.DelState(args[1])
	if err != nil {
		return shim.Error("Fail Update")
	}

	trust = Trust{
		Token : args[0],
		PreToken : args[1],
		Username : args[2],
		TelephoneNum : args[3],
		RealtorName : args[4],
		RealtorTelephoneNum : args[5],
		RealtorCellphoneNum : args[6],
		Type: args[7],
		SecurityDeposit : args[8],
		Rent : args[9],
		Purpose : args[10],
		PeriodStart : args[11],
		PeriodEnd : args[12],
		Etc : args[13],
		Status : args[14],
		Contract : args[15]}
	
	var Attachment = Attachment{}

	for i := 16; i < len(args); i+=2 {
		Attachment.Filename = args[i]
		Attachment.FilePath = args[i + 1]

		trust.Attachments = append(trust.Attachments, Attachment)
	}

	trustAsBytes, _ = json.Marshal(trust)
	APIstub.PutState(args[0], trustAsBytes)

	return shim.Success(nil)

}

func  (s *SmartContract) removeTrust(APIstub shim.ChaincodeStubInterface, args []string) sc.Response {
	if len(args) != 1 {
		return shim.Error("fail!")
	}

	err := APIstub.DelState(args[0])

	if err != nil {
		return shim.Error("Fail Delete")
	}
	
	return shim.Success(nil)
}

func  (s *SmartContract) readTrust(APIstub shim.ChaincodeStubInterface, args []string) sc.Response {
	if len(args) != 1 {
		return shim.Error("fail!")
	}

	trustAsBytes, _ := APIstub.GetState(args[0])

	return shim.Success(trustAsBytes)
}

func  (s *SmartContract) readAllTrust(APIstub shim.ChaincodeStubInterface) sc.Response {
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

func (s *SmartContract) setStatus(APIstub shim.ChaincodeStubInterface, args []string) sc.Response {
	if len(args) != 2 {
		return shim.Error("fail!")
	}

	trustAsBytes, _ := APIstub.GetState(args[0])
	trust := Trust{}

	json.Unmarshal(trustAsBytes, &trust)

	trust.Status = args[1]

	trustAsBytes, _ = json.Marshal(trust)
	APIstub.PutState(args[0], trustAsBytes)

	return shim.Success(nil)
}

func (s *SmartContract) readStatus(APIstub shim.ChaincodeStubInterface, args []string) sc.Response {
	if len(args) != 1 {
		return shim.Error("fail!")
	}

	trustAsBytes, _ := APIstub.GetState(args[0])
	trust := Trust{}

	json.Unmarshal(trustAsBytes, &trust)

	return shim.Success([]byte(trust.Status))
}

func (s *SmartContract) setContract(APIstub shim.ChaincodeStubInterface, args []string) sc.Response {
	if len(args) != 2 {
		return shim.Error("fail!")
	}

	trustAsBytes, _ := APIstub.GetState(args[0])
	trust := Trust{}

	json.Unmarshal(trustAsBytes, &trust)

	trust.Contract = args[1]

	trustAsBytes, _ = json.Marshal(trust)
	APIstub.PutState(args[0], trustAsBytes)

	return shim.Success(nil)
}

func main() {
	err := shim.Start(new(SmartContract))
	if err != nil {
		fmt.Printf("Error creating new Smart Contract : %s", err)
	}
}