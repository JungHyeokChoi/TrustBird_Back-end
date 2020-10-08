'use strict';

const { FileSystemWallet, Gateway } = require('fabric-network');
const fs = require('fs');
const path = require('path');
const YAML = require('yaml')

const ccpPath = path.resolve(__dirname, '..', 'network', 'connection.yaml');
const ccpYAML = fs.readFileSync(ccpPath, 'utf8');
const ccp = YAML.parse(ccpYAML);

async function userTx(data) {
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

        switch(data.function) {
            case "addUser" :
                await contract.submitTransaction(
                    data.function,
                    data.username,
                    data.email,
                    data.dateOfBirth,
                    data.gender,
                    data.telephoneNum
                )

                let result = {
                    result: true
                }

                return result;

            case "updateUser" :
                await contract.submitTransaction(
                    data.function,
                    data.username,
                    data.email,
                    data.dateOfBirth,
                    data.gender,
                    data.telephoneNum
                )

                let result = {
                    result: true
                }

                return result;

            case "removeUser" :
                await contract.submitTransaction(
                    data.function,
                    data.email
                )

                let result = {
                    result: true
                }

                return result;

            case "readUser" :
                var readUser = await contract.evaluateTransaction(
                    data.function,
                    data.email
                )
                
                let result = {
                    result: true,
                    data: readUser
                }             
                   
                if(!result.result){
                    console.log(error)
                } else {
                    return result;
                }

            default : 
                let result = {
                    result : false,
                    data : "함수를 찾을 수 없습니다."
                } 
                return result;
        }
    } catch (error) {
        console.error(`Failed to submit transaction: ${error}`);
        let result = {
            result : false,
            data : error
        }

        return result;
    }
}

module.exports = userTx