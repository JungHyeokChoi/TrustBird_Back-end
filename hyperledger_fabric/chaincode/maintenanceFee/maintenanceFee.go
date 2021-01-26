package main

import (
	"encoding/json"
	"fmt"
	"bytes"

	"github.com/hyperledger/fabric/core/chaincode/shim"
	sc "github.com/hyperledger/fabric/protos/peer"
)

type SmartContract struct {
}

type MaintenanceFee struct {
	Email string `json:"email"`
	ClaimingAgency string `json:"claimingAgency"`
	ElectronicPaymentNum string `json:"electronicPaymentNum"`
	DueDate string `json:"dueDate"`
	AmountDue string `json:"amountDue"`
	AmountDeadline string `json:"amountDeadline"`
	Payment string `json:"payment"`
	Payer string `json:"payer"`
	Giro Giro `json:"giro"`
}

type Giro struct {
	Filename string `json:"fileName"`
	FilePath string `json:"filePath"`
}

func (s *SmartContract) Init(APIstub shim.ChaincodeStubInterface) sc.Response {
	return shim.Success(nil)
}

func (s *SmartContract) Invoke(APIstub shim.ChaincodeStubInterface) sc.Response {
	function, args := APIstub.GetFunctionAndParameters()
	
	if function == "addMaintenanceFee" {
		return s.addMaintenanceFee(APIstub, args)
	} else if function == "updateMaintenanceFee" {
		return s.updateMaintenanceFee(APIstub, args)
	} else if function == "removeMaintenanceFee" {
		return s.removeMaintenanceFee(APIstub, args)
	} else if function == "readMaintenanceFee" {
		return s.readMaintenanceFee(APIstub, args)
	} else if function == "readAllMaintenanceFee" {
		return s.readAllMaintenanceFee(APIstub)
	}	

	return shim.Error("Invalid Smart Contract function name.")
}

func  (s *SmartContract) addMaintenanceFee(APIstub shim.ChaincodeStubInterface, args []string) sc.Response {
	if len(args) < 8 {
		return shim.Error("fail!")
	}
	var maintenanceFee = MaintenanceFee{
		Email : args[0],
		ClaimingAgency : args[1],
		ElectronicPaymentNum : args[2],
		DueDate : args[3],
		AmountDue : args[4],
		AmountDeadline : args[5],
		Payment : args[6],
		Payer : args[7],
		Giro : Giro{
			Filename : args[8],
			FilePath : args[9]}}

	maintenanceFeeAsBytes, _ := json.Marshal(maintenanceFee)
	APIstub.PutState(args[2], maintenanceFeeAsBytes)
	
	return shim.Success(nil)
}

func  (s *SmartContract) updateMaintenanceFee(APIstub shim.ChaincodeStubInterface, args []string) sc.Response {
	if len(args) < 8 {
		return shim.Error("fail!")
	}

	maintenanceFeeAsBytes, _ := APIstub.GetState(args[2])
	if(maintenanceFeeAsBytes == nil) {
		return shim.Error("This maintenanceFee is not exist. Update fail")
	}

	maintenanceFee := MaintenanceFee{}

	json.Unmarshal(maintenanceFeeAsBytes, &maintenanceFee)
	maintenanceFee = MaintenanceFee{
		Email : args[0],
		ClaimingAgency : args[1],
		ElectronicPaymentNum : args[2],
		DueDate : args[3],
		AmountDue : args[4],
		AmountDeadline : args[5],
		Payment : args[6],
		Payer : args[7],
		Giro : Giro{
			Filename : args[8],
			FilePath : args[9]}}

	maintenanceFeeAsBytes, _ = json.Marshal(maintenanceFee)
	APIstub.PutState(args[2], maintenanceFeeAsBytes)
	
	return shim.Success(nil)
}

func  (s *SmartContract) removeMaintenanceFee(APIstub shim.ChaincodeStubInterface, args []string) sc.Response {
	if len(args) != 1 {
		return shim.Error("fail!")
	}

	err := APIstub.DelState(args[0])

	if err != nil {
		return shim.Error("Fail Delete")
	}
	
	return shim.Success(nil)
}

func  (s *SmartContract) readMaintenanceFee(APIstub shim.ChaincodeStubInterface, args []string) sc.Response {
	if len(args) != 1 {
		return shim.Error("fail!")
	}

	maintenanceFeeAsBytes, _ := APIstub.GetState(args[0])
	
	return shim.Success(maintenanceFeeAsBytes)
}

func  (s *SmartContract) readAllMaintenanceFee(APIstub shim.ChaincodeStubInterface) sc.Response {
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

func main() {
	err := shim.Start(new(SmartContract))
	if err != nil {
		fmt.Printf("Error creating new Smart Contract : %s", err)
	}
}