'use strict';

const { objectToArray } = require('../utils')
const { sendTransactionProposal } = require('./utils') 

const contractTx = {
    addContract : async(request) => {
        try {
            const contract = new Array()

            objectToArray(request.contract, contract)

            const peer_request = {
                gateway : request.gateway,
                chaincodeId : 'contract',
                fcn : 'addContract',
                args : contract,
            }

            await sendTransactionProposal(peer_request, 60000)

            return true

        } catch (error) {
            console.log(error)

            return false
        }
    }, 
                
    updateContract : async(request) => {
        try {
            const contract = new Array()

            objectToArray(request.contract, contract)

            const peer_request = {
                gateway : request.gateway,
                chaincodeId : 'contract',
                fcn : 'updateContract',
                args : contract,
            }

            await sendTransactionProposal(peer_request, 60000)

            return true

        } catch (error) {
            console.log(error)

            return false
        }
    },
    
    removeContract : async(request) => {
        try {
            await request.contract.createTransaction('removeContract')
            .submit(
                request.token
            )

            return true

        } catch (error) {
            console.log(error)

            return false
        }
    },
        
    readContract : async(request) => {
        try {
            const result = await request.contract.createTransaction('readContract')
            .evaluate(
                request.token
            )
            
            if (result.length == 0) {
                return { 
                    result : true 
                }  
            } 

            return { 
                result : true,
                contract : JSON.parse(result)
            }

        } catch (error) {
            console.log(error)

            return {
                result : false,
                error : error
            }
        }
    },
        
    readAllContract : async(request) => {
        try {
            const result = await request.contract.createTransaction('readAllContract')
            .evaluate()
            
            if (result.length == 0) {
                return { 
                    result : true 
                }  
            } 

            return { 
                result : true,
                contracts : JSON.parse(result)
            }

        } catch (error) {
            console.log(error)

            return {
                result : false,
                error : error
            }
        }
    }
}

module.exports = contractTx