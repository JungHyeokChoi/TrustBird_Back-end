const web3 = require('web3')

const address = '0x197F50836dA8dd499548267A6375B371b65E646F';

const abi =[
    [
        {
            "constant": false,
            "inputs": [
                {
                    "internalType": "address",
                    "name": "client",
                    "type": "address"
                },
                {
                    "internalType": "bytes32",
                    "name": "hashValue",
                    "type": "bytes32"
                },
                {
                    "internalType": "uint16",
                    "name": "index",
                    "type": "uint16"
                }
            ],
            "name": "addHashValueOfContract",
            "outputs": [],
            "payable": false,
            "stateMutability": "nonpayable",
            "type": "function"
        },
        {
            "constant": false,
            "inputs": [
                {
                    "internalType": "address",
                    "name": "client",
                    "type": "address"
                },
                {
                    "internalType": "bytes32",
                    "name": "hashValue",
                    "type": "bytes32"
                },
                {
                    "internalType": "uint16",
                    "name": "index",
                    "type": "uint16"
                }
            ],
            "name": "addHashValueOfTrust",
            "outputs": [],
            "payable": false,
            "stateMutability": "nonpayable",
            "type": "function"
        },
        {
            "constant": false,
            "inputs": [
                {
                    "internalType": "address",
                    "name": "client",
                    "type": "address"
                },
                {
                    "internalType": "uint16",
                    "name": "index",
                    "type": "uint16"
                }
            ],
            "name": "removeHashValueOfContract",
            "outputs": [],
            "payable": false,
            "stateMutability": "nonpayable",
            "type": "function"
        },
        {
            "constant": false,
            "inputs": [
                {
                    "internalType": "address",
                    "name": "client",
                    "type": "address"
                },
                {
                    "internalType": "uint16",
                    "name": "index",
                    "type": "uint16"
                }
            ],
            "name": "removeHashValueOfTrust",
            "outputs": [],
            "payable": false,
            "stateMutability": "nonpayable",
            "type": "function"
        },
        {
            "inputs": [],
            "payable": false,
            "stateMutability": "nonpayable",
            "type": "constructor"
        },
        {
            "constant": true,
            "inputs": [
                {
                    "internalType": "address",
                    "name": "client",
                    "type": "address"
                }
            ],
            "name": "getHashValueOfContract",
            "outputs": [
                {
                    "internalType": "bytes32[]",
                    "name": "",
                    "type": "bytes32[]"
                }
            ],
            "payable": false,
            "stateMutability": "view",
            "type": "function"
        },
        {
            "constant": true,
            "inputs": [
                {
                    "internalType": "address",
                    "name": "client",
                    "type": "address"
                }
            ],
            "name": "getHashValueOfTrust",
            "outputs": [
                {
                    "internalType": "bytes32[]",
                    "name": "",
                    "type": "bytes32[]"
                }
            ],
            "payable": false,
            "stateMutability": "view",
            "type": "function"
        },
        {
            "constant": true,
            "inputs": [],
            "name": "totalContract",
            "outputs": [
                {
                    "internalType": "uint32",
                    "name": "",
                    "type": "uint32"
                }
            ],
            "payable": false,
            "stateMutability": "view",
            "type": "function"
        },
        {
            "constant": true,
            "inputs": [],
            "name": "totalTrust",
            "outputs": [
                {
                    "internalType": "uint32",
                    "name": "",
                    "type": "uint32"
                }
            ],
            "payable": false,
            "stateMutability": "view",
            "type": "function"
        }
    ]
];

const contract = new web3.eth.Contract(abi, address);
module.exports = contract
