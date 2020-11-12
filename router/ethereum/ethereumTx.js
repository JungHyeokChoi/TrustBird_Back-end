const Web3 = require('web3')
const web3 = new Web3(new Web3.providers.HttpProvider("http://localhost:8545"))

const ABI = require('../../ethereum/build/contracts/TrustBird').abi
// Contract Address
const CA = "0x31097d310E0B862AC11E7337d83Ce72Ee153EBD0"
const contract = new web3.eth.Contract(ABI, CA)

const account = "0xA41249C57ba04942CAB611158f2b2b269E5881a1"

const ethereumTx = {
    getHashValueOfTrust : async(request) => {
        try {
            const result = await contract.methods.getHashValueOfTrust(request.email).call({from: account})

            return {
                result : true,
                trusts : result
            }

        } catch(error) {
            console.log(error)

            return {
                result : false,
                error : error
            }
        }
    },

    addHashValueOfTrust : async(request) => {
        try {
            await contract.methods.addHashValueOfTrust(request.email, request.token, request.index).send({
                from: account,
                gas: 2000000,
                gasPrice:"300000"
            })
    
            return true

        } catch(error) {
            console.log(error)

            return false
        }
    },

    removeHashValueOfTrust : async(request) => {
        try {
            await contract.methods.removeHashValueOfTrust(request.email, request.index).send({
                from: account,
                gas: 2000000,
                gasPrice:"300000"
            })
           
            return true
        } catch(error) {
            console.log(error)

            return false
        }
    },

    getHashValueOfContract : async(request) => {
        try {
            const result = await contract.methods.getHashValueOfContract(request.token).call({from: account})
        
            return {
                result : true,
                contract : result
            }
        } catch(error) {
            console.log(error)

            return {
                result : false,
                error : error
            }
        }
    },

    addHashValueOfContract : async(request) => {
        try {
            await contract.methods.addHashValueOfContract(request.trustToken, request.contractToken).send({
                from: account,
                gas: 2000000,
                gasPrice:"300000"
            })
    
            return true

        } catch(error) {
            console.log(error)

            return false
        }
    },

    removeHashValueOfContract : async(request) => {
        try {
            await contract.methods.removeHashValueOfContract(request.trustToken).send({
                from: account,
                gas: 2000000,
                gasPrice:"300000"
            })
    
            return true

        } catch(error) {
            console.log(error)

            return false
        }
    }
}


module.exports =  ethereumTx;