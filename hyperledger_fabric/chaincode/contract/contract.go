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

type Contract struct {
	Contents Contents
	Lessor Lessor
	Lessee Lessee
	Realtor Realtor
}

type Contents struct {
	NewToken string `json:"newtoken"`
	PreToken string `json:"pretoken"`
	Location string `json:"location"`
	LandCategory string `json:"landcategory"`
	LandArea string `json:"landarea"`
	BuildingPurpose string `json:"buildingpurpose"`
	BuildingArea string `json:"buildingarea"`
	PartOfLeese string `json:"partofleese"`
	PartOfLeeseArea string `json:"partofleesearea"`
	RentType string `json:"renttype"`
	PeriodStart string `json:"periodstart"`
	Periodend string `json:"periodeend"`
	SecurityDeposit string `json:"securitydeposit"`
	ContractPrice string `json:"contractprice"`
	InterimPrice string `json:"interimprice"`
	Balance string `json:"balance"`
	Rent string `json:"rent"`
	SpecialAgreement string `json:"specialagreement"`
}

type Lessor struct {
	Address string `json:"address"`
	RRN string `json:"rrn"`
	Name string `json:"name"`
	TelephoneNum string `json:"telephoneNum"`
}

type Lessee struct {
	Address string `json:"address"`
	RRN string `json:"rrn"`
	Name string `json:"name"`
	TelephoneNum string `json:"telephoneNum"`
}

type Realtor struct {
	Address string `json:"address"`
	OfficeName string `json:"officename"`
	Name string `json:"name"`
	RegistrationNum string `json:"registrationnum"`
	TelephoneNum string `json:"telephonenum"`
}

func (s *SmartContract) Init(APIstub shim.ChaincodeStubInterface) sc.Response {
	return shim.Success(nil)
}

func (s *SmartContract) Invoke(APIstub shim.ChaincodeStubInterface) sc.Response {
	function, args := APIstub.GetFunctionAndParameters()

	if function == "addContract" {
		return s.addContract(APIstub, args)
	} else if function == "updateContract" {
		return s.updateContract(APIstub, args)
	} else if function == "removeContract" {
		return s.removeContract(APIstub, args)
	} else if function == "readContract" {
		return s.readContract(APIstub, args)
	} else if function == "readAllContract" {
		return s.readAllContract(APIstub)
	}

	return shim.Error("Invalid Smart Contract function name.")
}

func  (s *SmartContract) addContract(APIstub shim.ChaincodeStubInterface, args []string) sc.Response {
	if len(args) != 31 {
		return shim.Error("fail!")
	}

	var contract = Contract{
		Contents{
			NewToken : args[0],
			PreToken : args[1],
			Location : args[2],
			LandCategory : args[3],
			LandArea : args[4],
			BuildingPurpose : args[5],
			BuildingArea : args[6],
			PartOfLeese : args[7],
			PartOfLeeseArea : args[8],
			RentType : args[9],
			PeriodStart : args[10],
			Periodend : args[11],
			SecurityDeposit : args[12],
			ContractPrice : args[13],
			InterimPrice : args[14],
			Balance : args[15],
			Rent : args[16],
			SpecialAgreement : args[17]},
		Lessor{
			Address : args[18],
			RRN : args[19],
			Name : args[20],
			TelephoneNum : args[21]},
		Lessee{
			Address : args[22],
			RRN : args[23],
			Name : args[24],
			TelephoneNum : args[25]},
		Realtor{
			Address : args[26],
			OfficeName : args[27],
			Name : args[28],
			RegistrationNum : args[29],
			TelephoneNum : args[30]}}

	contractAsBytes, _ := json.Marshal(contract)
	APIstub.PutState(args[0], contractAsBytes)

	return shim.Success(nil)
}

func  (s *SmartContract) updateContract(APIstub shim.ChaincodeStubInterface, args []string) sc.Response {
	if len(args) != 31 {
		return shim.Error("fail!")
	}

	contractAsBytes, _ := APIstub.GetState(args[1])
	contract := Contract{}

	json.Unmarshal(contractAsBytes, &contract)
	contract = Contract{
		Contents{
			NewToken : args[0],
			PreToken : args[1],
			Location : args[2],
			LandCategory : args[3],
			LandArea : args[4],
			BuildingPurpose : args[5],
			BuildingArea : args[6],
			PartOfLeese : args[7],
			PartOfLeeseArea : args[8],
			RentType : args[9],
			PeriodStart : args[10],
			Periodend : args[11],
			SecurityDeposit : args[12],
			ContractPrice : args[13],
			InterimPrice : args[14],
			Balance : args[15],
			Rent : args[16],
			SpecialAgreement : args[17]},
		Lessor{
			Address : args[18],
			RRN : args[19],
			Name : args[20],
			TelephoneNum : args[21]},
		Lessee{
			Address : args[22],
			RRN : args[23],
			Name : args[24],
			TelephoneNum : args[25]},
		Realtor{
			Address : args[26],
			OfficeName : args[27],
			Name : args[28],
			RegistrationNum : args[29],
			TelephoneNum : args[30]}}
			
	contractAsBytes, _ = json.Marshal(contract)
	APIstub.PutState(args[0], contractAsBytes)

	return shim.Success(nil)
}

func  (s *SmartContract) removeContract(APIstub shim.ChaincodeStubInterface, args []string) sc.Response {
	if len(args) != 1 {
		return shim.Error("fail!")
	}

	err := APIstub.DelState(args[0])

	if err != nil {
		return shim.Error("Fail Delete")
	}

	return shim.Success(nil)
}

func  (s *SmartContract) readContract(APIstub shim.ChaincodeStubInterface, args []string) sc.Response {
	if len(args) != 1 {
		return shim.Error("fail!")
	}

	contractAsBytes, _ := APIstub.GetState(args[0])
	
	return shim.Success(contractAsBytes)
}

func  (s *SmartContract) readAllContract(APIstub shim.ChaincodeStubInterface) sc.Response {
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