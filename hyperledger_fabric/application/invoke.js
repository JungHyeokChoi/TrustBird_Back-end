/*
 * SPDX-License-Identifier: Apache-2.0
 */

'use strict';

const { FileSystemWallet, Gateway } = require('fabric-network');
const fs = require('fs');
const path = require('path');
const YAML = require('yaml')

const ccpPath = path.resolve(__dirname, '..', 'network', 'connection.yaml');
const ccpYAML = fs.readFileSync(ccpPath, 'utf8');
const ccp = YAML.parse(ccpYAML)

async function main() {
    try {

        // Create a new file system based wallet for managing identities.
        const walletPath = path.join(process.cwd(), 'wallet');
        const wallet = new FileSystemWallet(walletPath);
        console.log(`Wallet path: ${walletPath}`);

        // Check to see if we've already enrolled the user.
        const userExists = await wallet.exists('user1');
        if (!userExists) {
            console.log('An identity for the user "user1" does not exist in the wallet');
            console.log('Run the registerUser.js application before retrying');
            return;
        }

        // Create a new gateway for connecting to our peer node.
        const gateway = new Gateway();
        await gateway.connect(ccp, { wallet, identity: 'user1', discovery: { enabled: true, asLocalhost : true } });

        // Get the network (channel) our contract is deployed to.
        const network = await gateway.getNetwork('mychannel');

        // Chaincode available : user, trust, contract, maintenanceFee
        // Get the contract from the network.
        const contract = network.getContract('user');

        /*
            Example

            Chaincode Name : user
                const result = await contract.submitTransaction('addUser', 'Username', 'Email', 'Password', 'DateOfBirth', 'Gender', 'TelephoneNum')
                const result = await contract.submitTransaction('updateUser', 'Username', 'Email', 'Password', 'DateOfBirth', 'Gender', 'TelephoneNum')
                const result = await contract.submitTransaction('removeUser', 'Target Email')
            
            Chaincode Name : trust
                const result = await contract.submitTransaction('addTrust', 'NewToken', 'PreToken', 'Type', 'Price', 'TrustProfit', 'NegligenceProfit', 'Purpose', 'PeriodStart', 'PeriodEnd', 'Etc', 'Attachments')
                const result = await contract.submitTransaction('updateTrust', 'NewToken', 'PreToken', 'Type', 'Price', 'TrustProfit', 'NegligenceProfit', 'Purpose', 'PeriodStart', 'PeriodEnd', 'Etc', 'Attachments')
                const result = await contract.submitTransaction('removeTrust', 'Target Token')
                
            Chaincode Name : contract
                const result = await contract.submitTransaction('addContract', 'NewToken', 'PreToken', 'Location', 'LandCategory', 'LandArea', 'BuildingPurpose', 'BuildingArea', 'PartOfLeese', 'PartOfLeeseArea', 'RentType', 'PeriodStart', 'Periodend', 'SecurityDeposit', 'ContractPrice', 'InterimPrice', 'Balance', 'Rent', 'SpecialAgreement', 'Lessor Address', 'Lessor RRN', 'Lessor Name', 'Lessor TelephoneNum', 'Lessee Address', 'Lessee RRN', 'Lessee Name', 'Lessee TelephoneNum', 'Realtor Address', 'Realtor OfficeName', 'Realtor Name', 'Realtor RegistrationNum', 'Realtor TelephoneNum')
                const result = await contract.submitTransaction('updateContract', 'NewToken', 'PreToken', 'Location', 'LandCategory', 'LandArea', 'BuildingPurpose', 'BuildingArea', 'PartOfLeese', 'PartOfLeeseArea', 'RentType', 'PeriodStart', 'Periodend', 'SecurityDeposit', 'ContractPrice', 'InterimPrice', 'Balance', 'Rent', 'SpecialAgreement', 'Lessor Address', 'Lessor RRN', 'Lessor Name', 'Lessor TelephoneNum', 'Lessee Address', 'Lessee RRN', 'Lessee Name', 'Lessee TelephoneNum', 'Realtor Address', 'Realtor OfficeName', 'Realtor Name', 'Realtor RegistrationNum', 'Realtor TelephoneNum')
                const result = await contract.submitTransaction('removeContract', 'Target Token')
            
            Chaincode Name : maintenanceFee
                const result = await contract.submitTransaction('addMaintenanceFee', 'ClaimingAgency', 'ElectronicPaymenetNum', 'DueDate', 'Deadline', 'AmountDue', 'AmountDeadline', 'Payment', 'Giro')
                const result = await contract.submitTransaction('updateMaintenanceFee', 'ClaimingAgency', 'ElectronicPaymenetNum', 'DueDate', 'Deadline', 'AmountDue', 'AmountDeadline', 'Payment', 'Giro')
                const result = await contract.submitTransaction('removeMaintenanceFee', 'Target ElectronicPaymenetNum')
        */

        // Submit the specified transaction.
        await contract.submitTransaction('addUser', 'KilDongHong', 'example@gmail.com', 'qwer1234', '1982-09-05', 'man', '01012345678');
        console.log('Transaction has been submitted');

        // Disconnect from the gateway.
        await gateway.disconnect();

    } catch (error) {
        console.error(`Failed to submit transaction: ${error}`);
        process.exit(1);
    }
}

main();
