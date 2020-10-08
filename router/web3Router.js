const contract = require('./trustContract')
const Web3 = require('web3')
const web3 = new Web3(new Web3.providers.HttpProvider("http://localhost:7545"))

const allContract = (data) => {
    try{
        switch(data.function) {
            case "getHashValueOfTrust" :
                contract.methods.getHashValueOfTrust(data.client).call({from: data.client})
                .then((req) => {
                    var result = {
                        result : true,
                        data : req
                    }
                    return result;
                })

            case "getHashValueOfContract" :
                contract.methods.getHashValueOfTrust(data.client).call({from: data.client})
                .then((req) => {
                    var result = {
                        result : true,
                        data : req
                    }
                    return result;
                })
                break;
    
            case "addHashValueOfTrust" :
                contract.methods.addHashValueOfTrust(data.client, data.hashValue, data.index).send({
                    from: data.client,
                    value: web3.utils.toWei(data.client.money, 'ether'),
                    gas: 2000000
                }).then((req)=>{
                    console.log(req)
                    return 
                })
                break;
    
            case "addHashValueOfContract" :
                contract.methods.addHashValueOfContract(data.client, data.hashValue, data.index).send({
                    from: data.client,
                    value: web3.utils.toWei(data.client.money, 'ether'),
                    gas: 2000000
                }).then((req)=>{
                    console.log(req)
                    return 
                })
                break;
    
            case "removeHashValueOfTrust" :
                contract.methods.removeHashValueOfTrust(data.client, data.index).send({
                    from: data.client,
                    value: web3.utils.toWei(data.client.money, 'ether'),
                    gas: 2000000
                }).then((req)=>{
                    console.log(req)
                    return
                })
                break;
    
            case "removeHashValueOfContract" :
                contract.methods.removeHashValueOfContract(data.client, data.index).send({
                    from: data.client,
                    value: web3.utils.toWei(data.client.money, 'ether'),
                    gas: 2000000
                }).then((req)=>{
                    console.log(req)
                    return
                })
                break;
        }
    }
    catch(error) {
        console.log(error)
        var result = {
            result : false,
            data : "Error"
        }

        return result
    }
}


module.exports =  allContract;