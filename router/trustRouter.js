const router = require('express').Router()

const { upload, jsonToHash, selectProperties } = require('./utils')
const { wallet } = require('./hyperledger_fabric/utils')

const ipfs = require('./ipfs/ipfs')

const userTx = require('./hyperledger_fabric/userTx')
const trustTx = require('./hyperledger_fabric/trustTx')
const contractTx = require('./hyperledger_fabric/contractTx')

const authenticate = require('./passport/authenticate')

// Trust Subscription
router.route('/subscription')
    .post(authenticate.user, (req, res) => {
        upload.array('attachments')(req, res, async(err) => {
            if(err) {
                console.log(err)
                res.status(500).json({error : 'Internal error please try again'})
            }
            const email = req.user.permission === 'user' ? req.user.email : req.body.email
            const isEmail = 'email' in req.body

            if(isEmail) {
                delete req.body.email
            }

            const files = new Array()

            for (const file of req.files) {
                const result = await ipfs.add({
                    name : file.originalname,
                    path : file.path,
                    savePath : `trust/${email}`
                })

                files.push(result)
            }

            req.body.files = files

            const token = await jsonToHash(req.body)

            req.body.token = token

            const Trust = await wallet('trust')

            const trustRequest = {
                gateway : Trust.gateway,
                contract : Trust.contract,
                values : req.body
            }

            let result = await trustTx.addTrust(trustRequest)
            
            if (!result) {
                res.status(500).json({error : 'Internal error please try again'})
            } else {
                const User = await wallet('user')

                const userRequest = {
                    gateway : User.gateway,
                    contract : User.contract,
                    email : email,
                    targetAttr : 'Trust',
                    value : token
                }
                result = await userTx.addAttribute(userRequest)

                if(result) {
                    res.status(200).json({message : 'Trust Subscription Success'})
                } else {
                    res.status(500).json({error : 'Internal error please try again'})
                }
            }
        })
    })
    
// Trust Upload
router.route('/update')
    .post(authenticate.user, (req, res) => {
        upload.array('attachments')(req, res, async(err) => {
            if(err) {
                console.log(err)
                res.status(500).json({error : 'Internal error please try again'})
            }
            const email = req.user.permission === 'user' ? req.user.email : req.body.email
            const isEmail = 'email' in req.body

            if(isEmail) {
                delete req.body.email
            }

            const files = new Array()
            
            for (const file of req.files) {
                const result = await ipfs.add({
                    name : file.originalname,
                    path : file.path,
                    savePath : `trust/${email}`
                })

                files.push(result)
            }

            req.body.files = files

            const token = await jsonToHash(req.body)

            req.body.token = token

            const Trust = await wallet('Trust')

            const trustRequest = {
                gateway : Trust.gateway,
                contract : Trust.contract,
                values : req.body
            }

            let { result, error } = await trustTx.updateTrust(trustRequest)
            
            if (!result) {
                console.log(error)
                res.status(500).json({error : 'Internal error please try again'})
            } else {
                const User = await wallet('user')

                const userRequest = {
                    gateway : User.gateway,
                    contract : User.contract,
                    email : email,
                    targetAttr : 'Trust',
                    preValue : req.body.preToken,
                    newValue : token
                }

                result = await userTx.updateAttribute(userRequest)

                if(result) {
                    res.status(200).json({message : 'Trust Update Success'})
                } else {
                    res.status(500).json({error : 'Internal error please try again'})
                }
            }
        })
    })

// Trust Delete
router.route('/delete')
    .post(authenticate.user, async(req, res) => {
        const email = req.user.permission === 'user' ? req.user.email : req.body.email
        
        const Trust = await wallet('trust')

        let trustRequest = {
            gateway : Trust.gateway,
            contract : Trust.contract,
            token : req.body.token
        }

        const trustResponse = await trustTx.readTrust(trustRequest)

        if (!trustResponse.result) {
            console.log(trustResponse.error)
            res.status(500).json({error : 'Internal error please try again'})
        } else if(trustResponse.trust === undefined) { 
            res.status(401).json({message : 'This trust not exist'})
        } else {
            const isContract = 'contract' in trustResponse

            if(isContract && trustResponse.contract) {
                const Contract = await wallet('contract')
            
                const contractRequest = {
                    gateway : Contract.gateway,
                    contract : Contract.contract,
                    token : trustResponse.contract
                }

                const contractResponse = await contractTx.readContract(contractRequest)

                if (contractResponse.result) {
                    let result = await contractTx.removeContract(contractRequest)
                    
                    if(!result) {
                        res.status(500).json({error : 'Internal error please try again'})
                    } 
                }
            }

            result = await trustTx.removeTrust(trustRequest)
            
            if (!result) {
                res.status(500).json({error : 'Internal error please try again'})
            } else {
                const User = await wallet('user')

                const userRequest = {
                    gateway : User.gateway,
                    contract : User.contract,
                    email : email,
                    targetAttr : 'Trust',
                    value : req.body.token
                }

                result = await userTx.removeAttribute(userRequest)

                if(result) {
                    res.status(200).json({message : 'Trust Delete Success'})
                } else {
                    res.status(500).json({error : 'Internal error please try again'})
                }
            }
        }
    })

// Trust Find
router.route('/find')
    .get(authenticate.user, async(req, res) => {
        const Trust = await wallet('trust')

        const request = {
            gateway : Trust.gateway,
            contract : Trust.contract,
            token : req.body.token
        }

        const response = await trustTx.readTrust(request)

        if (!response.result) {
            console.log(response.error)
            res.status(500).json({error : 'Internal error please try again'})
        } else if(response.trust === undefined) { 
            res.status(401).json({message : 'This trust not exist'})
        } else {
            res.status(200).json(response.trust)
        }
    })

// Trust List
router.route('/list')
    .get(authenticate.admin, async(req, res) => {
        const Trust = await wallet('trust')

        const request = {
            gateway : Trust.gateway,
            contract : Trust.contract
        }

        const response = await trustTx.readAllTrust(request)

        if (!response.result) {
            console.log(response.error)
            res.status(500).json({error : 'Internal error please try again'})
        } else if(response.trusts === undefined) { 
            res.status(401).json({message : 'This trust not exist'})
        } else {
            const projection = {
                preToken : 0,
                telephoneNum : 0,
                realtorName : 0,
                realtorTelephoneNum : 0,
                realtorCellphoneNum : 0,
                etc : 0,
                contract : 0,
                attachments : 0
            }

            for (let trust of response.trusts) {
                await selectProperties(trust, projection)
            }
            
            res.status(200).json(response.trusts)
        }
    })

// Trsut Status Find & Change
router.route('/status')
    .get(authenticate.user, async(req, res) => {
        const Trust = await wallet('trust')

        const request = {
            gateway : Trust.gateway,
            contract : Trust.contract,
            token : req.body.token
        }

        const response = await trustTx.readStatus(request)

        if (!response.result) {
            console.log(response.error)
            res.status(500).json({error : 'Internal error please try again'})
        } else if(response.value === undefined) { 
            res.status(401).json({message : 'This trust not exist'})
        } else {
            res.status(200).json(response.value)
        }
    })

    .post(authenticate.admin, async(req, res) => {
        const Trust = await wallet('trust')

        const request = {
            gateway : Trust.gateway,
            contract : Trust.contract,
            token : req.body.token,
            status : req.body.status
        }

        const result = await trustTx.setStatus(request)

        if (result) {
            res.status(200).json({message : 'Trust Set Status Success'})
        } else {
            res.status(500).json({error : 'Internal error please try again'})
        }
    })

module.exports = router;