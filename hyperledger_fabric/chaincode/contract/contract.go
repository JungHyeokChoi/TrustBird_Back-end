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
	Token string `json:"token"`
	PreToken string `json:"preToken"`
	Location string `json:"location"`
	LandCategory string `json:"landCategory"`
	LandArea string `json:"landArea"`
	BuildingPurpose string `json:"buildingPurpose"`
	BuildingArea string `json:"buildingArea"`
	PartOfLeese string `json:"partOfLeese"`
	PartOfLeeseArea string `json:"partOfLeeseArea"`
	RentType string `json:"rentType"`
	PeriodStart string `json:"periodStart"`
	Periodend string `json:"periodEnd"`
	SecurityDeposit string `json:"securityDeposit"`
	ContractPrice string `json:"contractPrice"`
	InterimPrice string `json:"interimPrice"`
	Balance string `json:"balance"`
	Rent string `json:"rent"`
	SpecialAgreement string `json:"specialAgreement"`
	Lessor Lessor `json:"lessor"`
	Lessee Lessee `json:"lessee"`
	Realtor Realtor `json:"realtor"`
	Attachments []Attachment `json:"attachments"`
}

type Lessor struct {
	Address string `json:"address"`
	RRN string `json:"RRN"`
	Name string `json:"name"`
	TelephoneNum string `json:"telephoneNum"`
}

type Lessee struct {
	Address string `json:"address"`
	RRN string `json:"RRN"`
	Name string `json:"name"`
	TelephoneNum string `json:"telephoneNum"`
}

type Realtor struct {
	Address string `json:"address"`
	OfficeName string `json:"officeName"`
	Name string `json:"name"`
	RegistrationNum string `json:"registrationNum"`
	TelephoneNum string `json:"telephoneNum"`
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
	if len(args) < 31 {
		return shim.Error("fail!")
	}

	var contract = Contract{
		Token : args[0],
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
		SpecialAgreement : args[17],
		Lessor : Lessor{
			Address : args[18],
			RRN : args[19],
			Name : args[20],
			TelephoneNum : args[21]},
		Lessee : Lessee{
			Address : args[22],
			RRN : args[23],
			Name : args[24],
			TelephoneNum : args[25]},
		Realtor : Realtor{
			Address : args[26],
			OfficeName : args[27],
			Name : args[28],
			RegistrationNum : args[29],
			TelephoneNum : args[30]},
		Attachments : []Attachment{}}
	
	var Attachment = Attachment{}

	for i := 31; i < len(args); i+=2 {
		Attachment.Filename = args[i]
		Attachment.FilePath = args[i + 1]

		contract.Attachments = append(contract.Attachments, Attachment)
	}

	contractAsBytes, _ := json.Marshal(contract)
	APIstub.PutState(args[0], contractAsBytes)

	return shim.Success(nil)
}

func  (s *SmartContract) updateContract(APIstub shim.ChaincodeStubInterface, args []string) sc.Response {
	if len(args) < 31 {
		return shim.Error("fail!")
	}

	contractAsBytes, _ := APIstub.GetState(args[1])
	if(contractAsBytes == nil) {
		return shim.Error("This contract is not exist. Update fail")
	}

	contract := Contract{}

	json.Unmarshal(contractAsBytes, &contract)
	
	err := APIstub.DelState(args[1])
	if err != nil {
		return shim.Error("Fail Update")
	}

	contract = Contract{
		Token : args[0],
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
		SpecialAgreement : args[17],
		Lessor : Lessor{
			Address : args[18],
			RRN : args[19],
			Name : args[20],
			TelephoneNum : args[21]},
		Lessee : Lessee{
			Address : args[22],
			RRN : args[23],
			Name : args[24],
			TelephoneNum : args[25]},
		Realtor : Realtor{
			Address : args[26],
			OfficeName : args[27],
			Name : args[28],
			RegistrationNum : args[29],
			TelephoneNum : args[30]},
		Attachments : []Attachment{}}
			
	var Attachment = Attachment{}

	for i := 31; i < len(args); i+=2 {
		Attachment.Filename = args[i]
		Attachment.FilePath = args[i + 1]

		contract.Attachments = append(contract.Attachments, Attachment)
	}

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