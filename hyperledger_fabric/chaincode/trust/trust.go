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
	NewToken string `json:newtoken`
	PreToken string `json:pretoken`
	Type string `json:"type"`
	Price string `json:"price"`
	TrustProfit string `json:"trustprofit"`
	NegligenceProfit string `json:"negligenceprofit"`
	Purpose string `json:"purpose"`
	PeriodStart string `json:"periodstart"`
	PeriodEnd string `json:"periodend"`
	Etc string `json:"etc"`
	Attachments string `json:"attachments"`
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
	}

	return shim.Error("Invalid Smart Contract function name.")
}

func  (s *SmartContract) addTrust(APIstub shim.ChaincodeStubInterface, args []string) sc.Response {
	if len(args) != 11 {
		return shim.Error("fail!")
	}

	var trust = Trust{
		NewToken : args[0],
		PreToken : args[1],
		Type : args[2],
		Price : args[3],
		TrustProfit : args[4],
		NegligenceProfit : args[5],
		Purpose : args[6],
		PeriodStart : args[7],
		PeriodEnd : args[8],
		Etc : args[9],
		Attachments : args[10]}

	trustAsBytes, _ := json.Marshal(trust)
	APIstub.PutState(args[0], trustAsBytes)

	return shim.Success(nil)
}

func  (s *SmartContract) updateTrust(APIstub shim.ChaincodeStubInterface, args []string) sc.Response {
	if len(args) != 11 {
		return shim.Error("fail!")
	}

	trustAsBytes, _ := APIstub.GetState(args[1])
	trust := Trust{}

	json.Unmarshal(trustAsBytes, &trust)
	trust = Trust{
		NewToken : args[0],
		PreToken : args[1],
		Type : args[2],
		Price : args[3],
		TrustProfit : args[4],
		NegligenceProfit : args[5],
		Purpose : args[6],
		PeriodStart : args[7],
		PeriodEnd : args[8],
		Etc : args[9],
		Attachments : args[10]}

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
	startKey := "0x0000000000000000000000000000000000000000000000000000000000000000"
	endKey := "0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff"

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