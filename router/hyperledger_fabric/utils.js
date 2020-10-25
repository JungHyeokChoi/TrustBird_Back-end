/*
 * SPDX-License-Identifier: Apache-2.0
 */

'use strict';

const { FileSystemWallet, Gateway } = require('fabric-network')
const fs = require('fs')
const path = require('path')
const YAML = require('yaml')

const ccpPath = path.resolve(__dirname, '..', '..', 'hyperledger_fabric', 'network', 'connection.yaml')
const ccpYAML = fs.readFileSync(ccpPath, 'utf8')
const ccp = YAML.parse(ccpYAML)

const wallet = async(chaincodId) => {
    try {
        // Create a new file system based wallet for managing identities.
        const walletPath = path.join(process.cwd(), 'hyperledger_fabric', 'application', 'wallet')
        const wallet = new FileSystemWallet(walletPath)

        // Check to see if we've already enrolled the user.
        const userExists = await wallet.exists('user1')
        if (!userExists) {
            console.log('An identity for the user "user1" does not exist in the wallet')
            console.log('Run the registerUser.js application before retrying')
            return;
        }

        // Create a new gateway for connecting to our peer node.
        const gateway = new Gateway();
        await gateway.connect(ccp, { wallet, identity: 'user1', discovery: { enabled: true, asLocalhost : true } })

        // Get the network (channel) our contract is deployed to.
        const network = await gateway.getNetwork('mychannel')

        // Chaincode available : user, trust, contract, maintenanceFee
        // Get the contract from the network.
        const contract = await network.getContract(chaincodId)

        return {
            gateway : gateway,
            contract : contract
        }
        
    } catch (error) {
        console.error(`Failed to submit transaction: ${error}`)
        const response = {
            result : false,
            response : error
        }

        return response
    }
}

const sendTransactionProposal = async(request) => {
    try {
        const client = request.gateway.getClient()
        const channel = client.getChannel('mychannel')
        if (!channel) {
            const message = `This channel was not defined in the connection profile`
            throw new Error(message)
        }

        const tx_id = client.newTransactionID()
        const tx_id_string = tx_id.getTransactionID()

        const peer_request = {
            chaincodeId : request.chaincodeId,
            fcn : request.fcn,
            args : request.args,
            txId : tx_id
        }

        const results = await channel.sendTransactionProposal(peer_request)
        const proposalResponses = results[0]
        const proposal = results[1]

        let all_good = true
        proposalResponses.forEach((proposalResponse) => {
            let one_good = false
            if (proposalResponse.response.status === 200){
                one_good = true
            }
            all_good = all_good & one_good
        })

        if (all_good) {
            const promises = []
            const event_hubs = channel.getChannelEventHubsForOrg()

            event_hubs.forEach((event_hub) => {
                const invokeEventPromise = new Promise((resolve, reject) => {
                    const event_timeout = setTimeout(() => {
                        const message = 'REQUEST_TIMEOUT' + event_hub.getPeerAddr()
                        event_hub.disconnect()
                    }, 3000)
                    event_hub.registerTxEvent(tx_id_string, (tx, code, block_num) => {
                        clearTimeout(event_timeout)

                        if(code !== 'VALID') {
                            const message = 'The invoke chaincode transaction was invalid, code : ' + code
                            reject(new Error(message))
                        } else {
                            const message = 'The invoke chaincode transaction was valid'
                            resolve(message)
                        }
                    }, (err) => {
                        clearTimeout(event_timeout)
                        reject(err)
                    }, {unregister : true, disconnect : true})
                    event_hub.connect()
                })
                promises.push(invokeEventPromise)
            })

            const orderer_request = {
                txId : tx_id,
                proposalResponses : proposalResponses,
                proposal : proposal
            }
            const sendPromise = channel.sendTransaction(orderer_request)
            promises.push(sendPromise)

            const results = await Promise.all(promises)
            const response = results.pop()

            if (response.status !== 'SUCCESS') {
                const message = 'Failed to order the transaction. Error code : ' + response.status
                throw new Error(message)
            }

            results.forEach((result) => {
                if(typeof result !== 'string') {
                    const message = event_hub_result.toString()
                    throw new Error(message)
                }
            })

        } else {
            const message = 'Failed to send Proposal and receive all good ProposalResponse'
            throw new Error(message)
        }

        return true

    } catch (error) {
        console.log(error)
        return false
    }
}

module.exports = {
    sendTransactionProposal,
    wallet
}