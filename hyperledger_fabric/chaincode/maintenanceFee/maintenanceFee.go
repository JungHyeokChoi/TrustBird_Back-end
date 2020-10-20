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
	ClaimingAgency string `json:"claimingagency"`
	ElectronicPaymenetNum string `json:"electronicpaymenetnum"`
	DueDate string `json:"duedate"`
	Deadline string `json:"deadline"`
	AmountDue string `json:"amountdue"`
	AmountDeadline string `json:"amountdeadline"`
	Payment string `json:"payment"`
	Giro Giro
}

type Giro struct {
	Filename string `json:"filename"`
	FilePath string `json:"filepath"`
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
	if len(args) < 7 {
		return shim.Error("fail!")
	}
	var maintenanceFee = MaintenanceFee{
		ClaimingAgency : args[0],
		ElectronicPaymenetNum : args[1],
		DueDate : args[2],
		Deadline : args[3],
		AmountDue : args[4],
		AmountDeadline : args[5],
		Payment : args[6],
		Giro : Giro{
			Filename : args[7],
			FilePath : args[8]}}

	maintenanceFeeAsBytes, _ := json.Marshal(maintenanceFee)
	APIstub.PutState(args[1], maintenanceFeeAsBytes)
	
	return shim.Success(nil)
}

func  (s *SmartContract) updateMaintenanceFee(APIstub shim.ChaincodeStubInterface, args []string) sc.Response {
	if len(args) < 7 {
		return shim.Error("fail!")
	}

	maintenanceFeeAsBytes, _ := APIstub.GetState(args[1])
	maintenanceFee := MaintenanceFee{}

	json.Unmarshal(maintenanceFeeAsBytes, &maintenanceFee)
	maintenanceFee = MaintenanceFee{
		ClaimingAgency : args[0],
		ElectronicPaymenetNum : args[1],
		DueDate : args[2],
		Deadline : args[3],
		AmountDue : args[4],
		AmountDeadline : args[5],
		Payment : args[6],
		Giro : Giro{
			Filename : args[7],
			FilePath : args[8]}}

	maintenanceFeeAsBytes, _ = json.Marshal(maintenanceFee)
	APIstub.PutState(args[1], maintenanceFeeAsBytes)
	
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
	startKey := "0000000000"
	endKey := "9999999999"

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
		buffer.WriteString("\"Record\":")
		buffer.WriteString(string(queryResponse.Value))
		buffer.WriteString("}")
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