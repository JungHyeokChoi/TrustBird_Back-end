const router = require('express').Router()
const passport = require('passport')

const { passwordToHash, selectProperties } = require('./utils')
const { wallet } = require('./hyperledger_fabric/utils')

const userTx = require('./hyperledger_fabric/userTx')
const trustTx = require('./hyperledger_fabric/trustTx')
const contractTx = require('./hyperledger_fabric/contractTx')
const maintenanceFeeTx = require('./hyperledger_fabric/maintenanceFeeTx')

const authenticate = require('./passport/authenticate')

// User SignUp
router.route('/signup')
    .post(async(req, res) => {
        const User = await wallet('user')
        
        let request = {
            gateway : User.gateway,
            contract : User.contract,
            email : req.body.email
        }

        const response = await userTx.readUser(request)

        if (!response.result) {
            console.log(response.error)
            res.status(500).json({error : 'Internal error please try again'})
        } else if(response.user !== undefined) { 
            res.status(401).json({message : 'This user exist'})
        } else {
            request = {
                gateway : User.gateway,
                contract : User.contract,
                username : req.body.username,
                email : req.body.email,
                password : passwordToHash(req.body.password),
                dateOfBirth : req.body.dateOfBirth,
                gender : req.body.gender,
                telephoneNum : req.body.telephoneNum,
                permisson : req.body.permission,
                membership : '0',
                balance : '0'
            }
    
            const result = await userTx.addUser(request)

            if (result) {
                res.status(200).json({message : 'Sign Up is Success'})
            } else {
                res.status(500).json({error : 'Internal error please try again'})
            }
        }
    })

// User SignIn
router.route('/signin')
    .post((req, res, next) => {
        passport.authenticate('local', (err, user, info) => {
            if(err) {
                console.log(err)
                return next(err)
            }
            if(!user) {
                return res.status(401).json(info)
            }

            return req.login(user, (err) => {
                if(err) {
                    console.log(err)
                    return next(err)
                }
                return res.status(200).json({message : 'SignIn Success'})
            })
        })(req, res, next)
    })

// User SignOut
router.route('/signout')
    .get((req, res) => {
        req.logout()
        res.status(200).json({message : 'Sign Out Success'})
    })

// User Modified
router.route('/modified')
    .post(authenticate.user, async(req, res) => {
        const email = req.user.permission === 'user' ? req.user.email : req.body.email

        const User = await wallet('user')
        
        let request = {
            gateway : User.gateway,
            contract : User.contract,
            email : email
        }

        const response = await userTx.readUser(request)

        if (!response.result) {
            console.log(response.error)
            res.status(500).json({error : 'Internal error please try again'})
        } else if(response.user === undefined) { 
            res.status(401).json({message : 'This user not exist'})
        } else {
            request = {
                gateway : User.gateway,
                contract : User.contract,
                username : req.body.username,
                email : email,
                password : passwordToHash(req.body.password),
                dateOfBirth : req.body.dateOfBirth,
                gender : req.body.gender,
                telephoneNum : req.body.telephoneNum,
                permisson : req.body.permission,
                membership : req.body.membership,
                balance : req.body.balance
            }
    
            const result = await userTx.updateUser(request)
    
            if (result) {
                req.logout()
                res.status(200).json({message : 'User modified Success'})
            } else {
                res.status(500).json({error : 'Internal error please try again'})
            }
        }
    })

// User find
router.route('/find')
    .get(authenticate.user, async(req, res) => {
        const email = req.user.permission === 'user' ? req.user.email : req.body.email

        const User = await wallet('user')

        const request = {
            gateway : User.gateway,
            contract : User.contract,
            email : email
        }

        const response = await userTx.readUser(request)

        if (!response.result) {
            console.log(response.error)
            res.status(500).json({error : 'Internal error please try again'})
        } else if(response.user === undefined) { 
            res.status(401).json({message : 'This user not exist'})
        } else {
            res.status(200).json(response.user)
        }
    })

// User Withdrawal
router.route('/withdrawal')
    .post(authenticate.user, async(req, res) => {
        const email = req.user.permission === 'user' ? req.user.email : req.body.email

        const User = await wallet('user')

        const userRequest = {
            gateway : User.gateway,
            contract : User.contract,
            email : email
        }

        const userResponse = await userTx.readUser(userRequest)

        if (!userResponse.result) {
            console.log(userResponse.error)
            res.status(500).json({error : 'Internal error please try again'})
        } else if(userResponse.user === undefined) { 
            res.status(401).json({message : 'This user not exist'})
        } else {
            const isTrust = 'trust' in userResponse.user
            const isMaintenanceFee = 'maintenanceFee' in userResponse.user       

            if(isTrust && userResponse.user.trust) {
                const Trust = await wallet('trust')

                for(let token of userResponse.user.trust) {
                    const trustRequest = {
                        gateway : Trust.gateway,
                        contract : Trust.contract,
                        token : token
                    }

                    const trustResponse = await trustTx.readTrust(trustRequest)

                    if (!trustResponse.result) {
                        console.log(trustResponse.error)
                        res.status(500).json({error : 'Internal error please try again'})
                    } else if(trustResponse.trust === undefined) { 
                        console.log('This trust not exist')
                    } else {
                        const isContract = 'contract' in trustResponse.trust

                        if(isContract && trustResponse.trust.contract){
                            const Contract = await wallet('contract')

                            const contractRequest = {
                                gateway : Contract.gateway,
                                contract : Contract.contract,
                                token : trustResponse.trust.contract
                            }

                            let result = await contractTx.removeContract(contractRequest)

                            if(!result) {
                                res.status(500).json({error : 'Internal error please try again'})
                            }
                        }

                        result = await trustTx.removeTrust(trustRequest)

                        if(!result) {
                            res.status(500).json({error : 'Internal error please try again'})
                        }
                    }
                }
            }

            if(isMaintenanceFee && userResponse.user.maintenanceFee) {
                const MaintenanceFee = await wallet('maintenanceFee')

                for(let electronicPaymentNum of userResponse.user.maintenanceFee) {
                    const maintenanceFeeRequest = {
                        gateway : MaintenanceFee.gateway,
                        contract : MaintenanceFee.contract,
                        electronicPaymentNum : electronicPaymentNum
                    }

                    result = await maintenanceFeeTx.removeMaintenanceFee(maintenanceFeeRequest)

                    if(!result) {
                        res.status(500).json({error : 'Internal error please try again'})
                    }
                }
            }

            result = await userTx.removeUser(userRequest)

            if(result) {
                res.status(200).json({message : 'Withdrawal Success'})
            } else {
                res.status(500).json({error : 'Internal error please try again'})
            }
        }
    })

// User find or update Target attribute 
router.route('/attribute')
    .get(authenticate.user, async(req, res) => {
        const email = req.user.permission === 'user' ? req.user.email : req.body.email

        const User = await wallet('user')

        const request = {
            gateway : User.gateway,
            contract : User.contract,
            email : email,
            targetAttr : req.body.targetAttr
        }

        const response  = await userTx.readAttribute(request)

        if (!response.result) {
            console.log(response.error)
            res.status(500).json({error : 'Internal error please try again'})
        } else if(response.value === undefined) { 
            res.status(401).json({message : 'This user attribute not exist'})
        } else {
            res.status(200).json(response.value)
        }
    })

    .post(authenticate.admin, async(req, res) => {
        const User = await wallet('user')

        if (req.body.invoke === 'add') {
            const request = {
                gateway : User.gateway,
                contract : User.contract,
                email : req.body.email,
                targetAttr : req.body.targetAttr,
                value : req.body.value
            }
            const result = await userTx.addAttribute(request)

            if (result) {
                res.status(200).json({message : 'Add Attribute Success'})
            } else {
                res.status(500).json({error : 'Internal error please try again'})
            }
        } else if (req.body.invoke === 'update') {
            const request = {
                gateway : User.gateway,
                contract : User.contract,
                email : email,
                targetAttr : req.body.targetAttr,
                preValue : req.body.preValue,
                newValue : req.body.newValue
            }
            const result = await userTx.updateAttribute(request)

            if (result) {
                res.status(200).json({message : 'Update Attribute Success'})
            } else {
                res.status(500).json({error : 'Internal error please try again'})
            }
        } else if (req.body.invoke === 'remove') {
            const request = {
                gateway : User.gateway,
                contract : User.contract,
                email : email,
                targetAttr : req.body.targetAttr,
                value : req.body.value
            }
            const result = await userTx.removeAttribute(request)

            if (result) {
                res.status(200).json({message : 'Remove Attribute Success'})
            } else {
                res.status(500).json({error : 'Internal error please try again'})
            }
        } else {
            res.status(401).json({message : 'Invaild Invoke'})
        }
    })

// User Trust List
router.route('/trustlist')
    .get(authenticate.user, async(req, res)=>{
        const email = req.user.permission === 'admin' ? req.body.email : req.user.email
        
        const User = await wallet('user')

        const userRequest = {
            gateway : User.gateway,
            contract : User.contract,
            email : email,
            targetAttr : 'Trust'
        }

        const userResponse = await userTx.readAttribute(userRequest)

        if (!userResponse.result) {
            console.log(userResponse.error)
            res.status(500).json({error : 'Internal error please try again'})
        } else if(userResponse.value === undefined) { 
            res.status(401).json({message : 'This user not exist'})
        } else {
            const trusts = new Array()

            for(let token of userResponse.value) {
                const Trust = await wallet('trust')

                const trustRequest = {
                    gateway : Trust.gateway,
                    contract : Trust.contract,
                    token : token
                }

                const trustResponse = await trustTx.readTrust(trustRequest)

                if (!trustResponse.result) {
                    console.log(trustResponse.error)
                    res.status(500).json({error : 'Internal error please try again'})
                } else if(trustResponse.trust === undefined) { 
                    res.status(401).json({message : 'This trust not exist'})
                } else {
                    const projection = {
                        token : 1,
                        type : 1,
                        securityDeposit : 1,
                        rent : 1,
                        periodStart : 1,
                        periodEnd : 1,
                        status : 1
                    }
                    await selectProperties(trustResponse.trust, projection)

                    trusts.push(trustResponse.trust)
                }
            }
            res.status(200).json(trusts)
        }
    })

// User MaintenanceFee List
router.route('/maintenancefeelist')
    .get(authenticate.user, async(req, res) => {
        const email = req.user.permission === 'admin' ? req.body.email : req.user.email
        
        const User = await wallet('user')

        const userRequest = {
            gateway : User.gateway,
            contract : User.contract,
            email : email,
            targetAttr : 'MaintenanceFee'
        }

        const userResponse = await userTx.readAttribute(userRequest)

        if (!userResponse.result) {
            console.log(userResponse.error)
            res.status(500).json({error : 'Internal error please try again'})
        } else if(userResponse.value === undefined) { 
            res.status(401).json({message : 'This user not exist'})
        } else {
            const maintenanceFees = new Array()

            for(let electronicPaymentNum of response.maintenanceFee) {
                const MaintenanceFee = await wallet('maintenanceFee')

                const maintenanceFeeRequest = {
                    gateway : MaintenanceFee.gateway,
                    contract : MaintenanceFee.contract,
                    electronicPaymentNum : electronicPaymentNum
                }

                const maintenanceFeeResponse = await maintenanceFeeTx.readTrust(maintenanceFeeRequest)

                if (!maintenanceFeeResponse.result) {
                    console.log(maintenanceFeeResponse.error)
                    res.status(500).json({error : 'Internal error please try again'})
                } else if(maintenanceFeeResponse.maintenanceFee === undefined) { 
                    res.status(401).json({message : 'This maintenanceFee not exist'})
                } else {
                    const projection = {
                        claimingAgency : 1,
                        electronicPaymentNum : 1,
                        dueDate : 1,
                        amountDue : 1 
                    }
                    await selectProperties(maintenanceFeeResponse.maintenanceFee, projection)

                    maintenanceFees.push(maintenanceFeeResponse.maintenanceFee)
                }
            }
            res.status(200).json(maintenanceFees)
        }
    })

module.exports = router;