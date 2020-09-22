/*
 * SPDX-License-Identifier: Apache-2.0
 */

'use strict';

const { FileSystemWallet, Gateway } = require('fabric-network');
const fs = require('fs');
const path = require('path');
const YAML = require('yaml');

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
        await gateway.connect(ccp, { wallet, identity: 'user1', discovery: { enabled: true, asLocalhost : true} });

        // Get the network (channel) our contract is deployed \to.
        const network = await gateway.getNetwork('mychannel');

        // Chaincode available : user, trust, contract, maintenanceFee
        // Get the contract from the network.
        const contract = network.getContract('user');

        /*
            Example

            Chaincode Name : user
                const result = await contract.evaluateTransaction('readUser', 'Target Email')
            
            Chaincode Name : trust
                const result = await contract.evaluateTransaction('readTrust', 'Target Token')
                const result = await contract.evaluateTransaction('readAllTrust')
                
            Chaincode Name : contract
                const result = await contract.evaluateTransaction('readContract', 'Target Token')
                const result = await contract.evaluateTransaction('readAllContract')
            
            Chaincode Name : maintenanceFee
                const result = await contract.evaluateTransaction('readMaintenanceFee', 'Target ElectronicPaymenetNum')
                const result = await contract.evaluateTransaction('readAllMaintenanceFee')
        */

        // Evaluate the specified transaction.
        const result = await contract.evaluateTransaction('readUser', 'example@gmail.com');
        console.log(`Transaction has been evaluated, result is: ${result.toString()}`);

    } catch (error) {
        console.error(`Failed to evaluate transaction: ${error}`);
        process.exit(1);
    }
}

main();
