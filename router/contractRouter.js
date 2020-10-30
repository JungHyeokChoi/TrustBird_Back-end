const router = require('express').Router()

const { upload, jsonToHash, selectProperties } = require('./utils')
const { wallet } = require('./hyperledger_fabric/utils')

const ipfs = require('./ipfs/ipfs')

const trustTx = require('./hyperledger_fabric/trustTx')
const contractTx = require('./hyperledger_fabric/contractTx')

const authenticate = require('./passport/authenticate')

// Contract Enroll
router.route('/enroll')
    .post(authenticate.admin, (req, res) => {
        upload.array('attachments')(req, res, async(err) => {
            console.log('Contract Enroll...')

            if(err) {
                console.log(err)
                res.status(500).json({error : 'Internal error please try again'})
            }
            const files = new Array()

            for (const file of req.files) {
                const result = await ipfs.add({
                    name : file.originalname,
                    path : file.path,
                    savePath : `contract/${req.body.trustToken}`
                })

                files.push(result)
            }

            req.body.files = files

            const token = await jsonToHash(req.body)
            req.body.token = token

            const Contract = await wallet('contract')

            const contractRequest = {
                gateway : Contract.gateway,
                contract : {
                    token : req.body.token,
                    preToken : req.body.preToken,
                    locatino : req.body.location,
                    landCategory : req.body.landCategory,
                    landArea : req.body.landArea,
                    buildingPurpose : req.body.buildingPurpose,
                    buildingArea : req.body.buildingArea,
                    partOfLeese : req.body.partOfLeese,
                    partOfLeeseArea : req.body.partOfLeeseArea,
                    rentType : req.body.rentType,
                    periodStart : req.body.periodStart,
                    periodEnd : req.body.periodEnd,
                    securityDeposit : req.body.securityDeposit,
                    contractPrice : req.body.contractPrice,
                    interimPrice : req.body.interimPrice,
                    balance : req.body.balance,
                    rent : req.body.rent,
                    specialAgreement : req.body.specialAgreement,
                    lessor : {
                        address : req.body.lessor.address,
                        RRN : req.body.lessor.RRN,
                        name : req.body.lessor.name,
                        telephoneNum : req.body.lessor.telephoneNum
                    },
                    lessee : {
                        address : req.body.lessee.address,
                        RRN : req.body.lessee.RRN,
                        name : req.body.lessee.name,
                        telephoneNum : req.body.lessee.telephoneNum
                    },
                    realtor : {
                        address: req.body.realtor.address,
                        officeName: req.body.realtor.officeName,
                        name: req.body.realtor.name,
                        registrationNum: req.body.realtor.registrationNum,
                        telephoneNum: req.body.realtor.telephoneNum
                    },
                    attachments : req.body.files,
                }
            }

            let result = await contractTx.addContract(contractRequest)
            
            if (!result) {
                res.status(500).json({error : 'Internal error please try again'})
            } else {
                const Trust = await wallet('trust')
                
                const trustRequest = {
                    contract : Trust.contract,
                    trustToken : req.body.trustToken,
                    contractToken : token
                }

                result = await trustTx.setContract(trustRequest)

                if(result) {
                    res.status(200).json({message : 'Contract Enroll Success'})
                } else {
                    res.status(500).json({error : 'Internal error please try again'})
                }
            }
        })
    })

// Contract Update
router.route('/update')
    .post(authenticate.admin, (req, res) => {
        upload.array('attachments')(req, res, async(err) => {
            console.log('Contract Update...')

            if(err) {
                console.log(err)
                res.status(500).json({error : 'Internal error please try again'})
            }
            const files = new Array()

            for (const file of req.files) {
                const result = await ipfs.add({
                    name : file.originalname,
                    path : file.path,
                    savePath : `contract/${req.body.trustToken}`
                })

                files.push(result)
            }

            req.body.files = files

            const token = await jsonToHash(req.body)
            req.body.token = token

            const Contract = await wallet('contract')

            const contractRequest = {
                gateway : Contract.gateway,
                contract : {
                    token : req.body.token,
                    preToken : req.body.preToken,
                    locatino : req.body.location,
                    landCategory : req.body.landCategory,
                    landArea : req.body.landArea,
                    buildingPurpose : req.body.buildingPurpose,
                    buildingArea : req.body.buildingArea,
                    partOfLeese : req.body.partOfLeese,
                    partOfLeeseArea : req.body.partOfLeeseArea,
                    rentType : req.body.rentType,
                    periodStart : req.body.periodStart,
                    periodEnd : req.body.periodEnd,
                    securityDeposit : req.body.securityDeposit,
                    contractPrice : req.body.contractPrice,
                    interimPrice : req.body.interimPrice,
                    balance : req.body.balance,
                    rent : req.body.rent,
                    specialAgreement : req.body.specialAgreement,
                    lessor : {
                        address : req.body.lessor.address,
                        RRN : req.body.lessor.RRN,
                        name : req.body.lessor.name,
                        telephoneNum : req.body.lessor.telephoneNum
                    },
                    lessee : {
                        address : req.body.lessee.address,
                        RRN : req.body.lessee.RRN,
                        name : req.body.lessee.name,
                        telephoneNum : req.body.lessee.telephoneNum
                    },
                    realtor : {
                        address: req.body.realtor.address,
                        officeName: req.body.realtor.officeName,
                        name: req.body.realtor.name,
                        registrationNum: req.body.realtor.registrationNum,
                        telephoneNum: req.body.realtor.telephoneNum
                    },
                    attachments : req.body.files,
                }
            }

            let result = await contractTx.updateContract(contractRequest)
            
            if (!result) {
                res.status(500).json({error : 'Internal error please try again'})
            } else {
                const Trust = await wallet('trust')
                
                const trustRequest = {
                    contract : Trust.contract,
                    trustToken : req.body.trustToken,
                    contractToken : token
                }

                result = await trustTx.setContract(trustRequest)

                if(result) {
                    res.status(200).json({message : 'Contract Update Success'})
                } else {
                    res.status(500).json({error : 'Internal error please try again'})
                }
            }
        })
    })

// Contract Delete
router.route('/delete')
    .post(authenticate.admin, async(req, res) => {
        console.log('Contract Delete...')

        const Contract = await wallet('contract')

            const contractRequest = {
                contract : Contract.contract,
                token : req.body.token
            }

            let result = await contractTx.removeContract(contractRequest)
            
            if (!result) {
                res.status(500).json({error : 'Internal error please try again'})
            } else {
                const Trust = await wallet('trust')
                
                const trustRequest = {
                    contract : Trust.contract,
                    trustToken : req.body.trustToken,
                    contractToken : ""
                }

                result = await trustTx.setContract(trustRequest)

                if(result) {
                    res.status(200).json({message : 'Contract Delete Success'})
                } else {
                    res.status(500).json({error : 'Internal error please try again'})
                }
            }
    })

// Contract Find
router.route('/find')
    .get(authenticate.user, async(req, res) => {
        console.log('Contract Find...')

        const Contract = await wallet('contract')

        const request = {
            contract : Contract.contract,
            token : req.query.token
        }

        const response = await contractTx.readContract(request)

        if (!response.result) {
            console.log(response.error)
            res.status(500).json({error : 'Internal error please try again'})
        } else if(response.contract === undefined) { 
            res.status(401).json({message : 'This contract not exist'})
        } else {
            res.status(200).json(response.contract)
        }
    })

// Contract List
router.route('/list')
    .get(authenticate.admin, async(req, res) => {
        console.log('Contract List...')

        const Contract = await wallet('contract')

        const request = {
            contract : Contract.contract
        }

        const response = await contractTx.readAllContract(request)

        if (!response.result) {
            console.log(response.error)
            res.status(500).json({error : 'Internal error please try again'})
        } else if(response.contracts === undefined) { 
            res.status(401).json({message : 'This contract not exist'})
        } else {
            const projection = {
                token : 1,
                location : 1, 
                rentType : 1, 
                periodStart : 1, 
                periodEnd : 1
            }

            for (let contract of response.contracts) {
                await selectProperties(contract, projection)
            }
            
            res.status(200).json(response.contracts)
        }
    })

module.exports = router;