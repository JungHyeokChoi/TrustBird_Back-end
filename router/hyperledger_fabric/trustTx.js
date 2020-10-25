'use strict';

const { objectToArray } = require('../utils')
const { sendTransactionProposal } = require('./utils')

const trustTx = {
    addTrust : async(request) => {
        try {
            const values = new Array()

            objectToArray(request.values, values)

            const peer_request = {
                gateway : request.gateway,
                chaincodeId : 'trust',
                fcn : 'addTrust',
                args : values,
            }

            await sendTransactionProposal(peer_request)

            return true

        } catch(error) {
            console.log(error)

            return false
        }   
    },
    
    updateTrust : async(request) => {
        try {
            const values = new Array()

            objectToArray(request.values, values)

            const peer_request = {
                gateway : request.gateway,
                chaincodeId : 'trust',
                fcn : 'updateTrust',
                args : values,
            }

            await sendTransactionProposal(peer_request)

            return true

        } catch(error) {
            console.log(error)

            return false
        }
    },

    removeTrust : async(request) => {
        try {
            await request.contract.createTransaction('removeTrust')
            .submit(
                request.token
            )

            return true

        } catch(error) {
            console.log(error)

            return false
        }
    },

    readTrust : async(request) => {
        try {
            const result = await request.contract.createTransaction("readTrust")
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
                trust : JSON.parse(result)
            }
            
        } catch(error) {
            console.log(error)

            return {
                result : false,
                error : error
            }
        }
    },

    readAllTrust : async(request) => {
        try {
            const result = await request.contract.createTransaction("readAllTrust")
            .evaluate()

            if (result.length == 0) {
                return { 
                    result : true 
                }  
            } 

            return { 
                result : true,
                trusts : JSON.parse(result)
            }
            
        } catch(error) {
            console.log(error)

            return {
                result : false,
                error : error
            }
        }
    },

    setStatus : async(request) => {
        try {
            await request.contract.createTransaction('setStatus')
            .submit(
                request.token,
                request.status
            )

            return true

        } catch(error) {
            console.log(error)

            return false
        }
    },

    readStatus : async(request) => {
        try {
            const result = await request.contract.createTransaction('readStatus')
            .evaluate(
                request.token
            )

            return { 
                result : true,
                value : result.toString()
            }
            
        } catch(error) {
            console.log(error)

            return {
                result : false,
                error : error
            }
        }
    },

    setContract : async(request) => {
        try {
            await request.contract.createTransaction('setContract')
            .submit(
                request.trustToken,
                request.contractToken
            )

            return true

        } catch(error) {
            console.log(error)

            return false
        }
    }
}

module.exports = trustTx