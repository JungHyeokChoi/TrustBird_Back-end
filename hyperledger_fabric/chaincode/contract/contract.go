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
	TrustToken string `json:"trustToken"`
	Token string `json:"token"`
	PreToken string `json:"preToken"`
	Location string `json:"location"`
	LandCategory string `json:"landCategory"`
	LandArea string `json:"landArea"`
	BuildingPurpose string `json:"buildingPurpose"`
	BuildingArea string `json:"buildingArea"`
	PartOfLease string `json:"partOfLease"`
	PartOfLeaseArea string `json:"partOfLeaseArea"`
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
	if len(args) < 32 {
		return shim.Error("fail!")
	}

	var contract = Contract{
		TrustToken : args[0],
		Token : args[1],
		PreToken : args[2],
		Location : args[3],
		LandCategory : args[4],
		LandArea : args[5],
		BuildingPurpose : args[6],
		BuildingArea : args[7],
		PartOfLease : args[8],
		PartOfLeaseArea : args[9],
		RentType : args[10],
		PeriodStart : args[11],
		Periodend : args[12],
		SecurityDeposit : args[13],
		ContractPrice : args[14],
		InterimPrice : args[15],
		Balance : args[16],
		Rent : args[17],
		SpecialAgreement : args[18],
		Lessor : Lessor{
			Address : args[19],
			RRN : args[20],
			Name : args[21],
			TelephoneNum : args[22]},
		Lessee : Lessee{
			Address : args[23],
			RRN : args[24],
			Name : args[25],
			TelephoneNum : args[26]},
		Realtor : Realtor{
			Address : args[27],
			OfficeName : args[28],
			Name : args[29],
			RegistrationNum : args[30],
			TelephoneNum : args[31]},
		Attachments : []Attachment{}}
	
	var Attachment = Attachment{}

	for i := 32; i < len(args); i+=2 {
		Attachment.Filename = args[i]
		Attachment.FilePath = args[i + 1]

		contract.Attachments = append(contract.Attachments, Attachment)
	}

	contractAsBytes, _ := json.Marshal(contract)
	APIstub.PutState(args[1], contractAsBytes)

	return shim.Success(nil)
}

func  (s *SmartContract) updateContract(APIstub shim.ChaincodeStubInterface, args []string) sc.Response {
	if len(args) < 32 {
		return shim.Error("fail!")
	}

	contractAsBytes, _ := APIstub.GetState(args[2])
	if(contractAsBytes == nil) {
		return shim.Error("This contract is not exist. Update fail")
	}

	contract := Contract{}

	json.Unmarshal(contractAsBytes, &contract)
	
	err := APIstub.DelState(args[2])
	if err != nil {
		return shim.Error("Fail Update")
	}

	contract = Contract{
		TrustToken : args[0],
		Token : args[1],
		PreToken : args[2],
		Location : args[3],
		LandCategory : args[4],
		LandArea : args[5],
		BuildingPurpose : args[6],
		BuildingArea : args[7],
		PartOfLease : args[8],
		PartOfLeaseArea : args[9],
		RentType : args[10],
		PeriodStart : args[11],
		Periodend : args[12],
		SecurityDeposit : args[13],
		ContractPrice : args[14],
		InterimPrice : args[15],
		Balance : args[16],
		Rent : args[17],
		SpecialAgreement : args[18],
		Lessor : Lessor{
			Address : args[19],
			RRN : args[20],
			Name : args[21],
			TelephoneNum : args[22]},
		Lessee : Lessee{
			Address : args[23],
			RRN : args[24],
			Name : args[25],
			TelephoneNum : args[26]},
		Realtor : Realtor{
			Address : args[27],
			OfficeName : args[28],
			Name : args[29],
			RegistrationNum : args[30],
			TelephoneNum : args[31]},
		Attachments : []Attachment{}}
			
	var Attachment = Attachment{}

	for i := 32; i < len(args); i+=2 {
		Attachment.Filename = args[i]
		Attachment.FilePath = args[i + 1]

		contract.Attachments = append(contract.Attachments, Attachment)
	}

	contractAsBytes, _ = json.Marshal(contract)
	APIstub.PutState(args[1], contractAsBytes)

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