const router = require('express').Router()
const passport = require('passport')

const User = require('../models/User')
const Trust = require('../models/Trust')
const Contract = require('../models/Contract')
const MaintenanceFee = require('../models/MaintenanceFee')

const authenticate = require('./passport/authenticate')

// User SignUp
router.route('/signup')
    .post((req, res) => {
        const user = new User(req.body)

        User.findOne({ email : req.body.email }, (err, result) => {
            if(err) {
                console.log(err)
                res.status(500).json({error : 'Internal error please try again'})
            } else if(result) {
                res.status(401).json({message : 'This user exist.'})
            } else {
                user.save((err) => {
                    if(err) {
                        console.log(err)
                        res.status(500).json({error : 'Internal error please try again'})
                    } else {
                        res.status(200).json({message : 'Sign Up is Success'})
                    }
                })
            }
        })
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
                return res.json({message : "SignIn Success"})
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
    .post(authenticate.user,(req, res) => {
        const email = req.user.permission === "admin" ? req.body.email : req.user.email

        User.updateOne({ email }, { $set : req.body }, (err, result) => {
            if(err) {
                console.log(err)
                res.status(500).json({error : 'Internal error please try again'})
            } else if(!result.n) {
                res.status(401).json({message : 'This user not exist'})
            } else {
                res.status(200).json({message: 'User Update'})
            }
        })
    })

// User find
router.route('/find')
    .get(authenticate.user, (req, res) => {
        const email = req.user.permission === "admin" ? req.body.email : req.user.email

        User.findOne({ email }, { _id : 0, __v : 0 }, (err, result) => {
            if(err) {
                console.log(err)
                res.status(500).json({error : 'Internal error please try again'})
            } else if(!result) {
                res.status(401).json({message : 'This user not exist. please using after sign up'})
            } else {
                res.status(200).json(result)
            }
        })
    })

// User Withdrawal
router.route('/withdrawal')
    .post(authenticate.user, (req, res) => {
        const email = req.user.permission === "admin" ? req.body.email : req.user.email

        User.findOne({ email }, async (err, result) => {
            if(err) {
                console.log(err)
                res.status(500).json({error : 'Internal error please try again'})
            } else if(!result) {
                res.status(401).json({message : 'This user not exist. please using after sign up'})
            } else {
                await result.trust.forEach((trust) => {
                    Trust.findOne({ token : trust }, (err, result) => {
                        if(err){
                            console.log(err)
                            res.status(500).json({error : 'Internal error please try again'})
                        } else {
                            const isKey = "contract" in result

                            if(isKey){
                                Contract.deleteOne({ token : result.contract }, (err, result) => {
                                    if(err){
                                        console.log(err)
                                        res.status(500).json({error : 'Internal error please try again'})
                                    }
                                })
                            }
                           
                        }
                    })
                })

                await result.maintenanceFee.forEach((maintenanceFee) => {
                    MaintenanceFee.deleteOne({ electronicPaymentNum : maintenanceFee }, (err, result) => {
                        if(err){
                            console.log(err)
                            res.status(500).json({error : 'Internal error please try again'})
                        }
                    })
                })

                await Trust.deleteOne({ token : result.trust }, (err, result) => {
                    if(err) {
                        console.log(err)
                        res.status(500).json({error : 'Internal error please try again'})
                    } else {
                        User.deleteOne({ email : req.session.email }, (err, result) => {
                            if(err) {
                                console.log(err)
                                res.status(500).json({error : 'Internal error please try again'})
                            } else {
                                req.logout()
                                res.status(200).json({message : 'Withdrawal Success'})
                            }
                        })
                    }
                })
            }
        })
    })

// User find or update Target attribute 
router.route('/attribute')
    .get(authenticate.user, (req, res) => {
        const email = req.user.permission === "admin" ? req.body.email : req.user.email

        User.findOne({ email }, { _id : 0 ,[`${req.body.targetAttr}`] : 1 }, { lean : true }, (err, result) => {
            const isKey = req.body.targetAttr in result

            if(err) {
                console.log(err)
                res.status(500).json({error : 'Internal error please try again'})
            } else if(!result) {
                res.status(401).json({message : 'This user not exist. please using after sign up'})
            } else if(!isKey) {
                res.status(401).json({message : 'Incorrect Attribute'})
            } else {
                res.status(200).json(result)
            }
        })
    })

    .post(authenticate.user, (req, res) => {
        if(req.body.attribute.target === "balance" && req.user.permission !== "admin"){
            res.status(401).json({message : "Invaild Authority"})
        }

        const email = req.user.permission === "admin" ? req.body.email : req.user.email

        User.updateOne({ email }, { $set : { [`${req.body.attribute.target}`] : req.body.attribute.data }}, (err, result) => {
            if(err) {
                console.log(err)
                res.status(500).json({error : 'Internal error please try again'})
            } else if(!result.n) {
                res.status(401).json({message : 'This user not exist'})
            } else {
                res.status(200).json({message: 'Attribute Update'})
            }
        })
    })

// User Trust List
router.route('/trustlist')
    .get(authenticate.user, (req, res)=>{
        const email = req.user.permission === "admin" ? req.body.email : req.user.email

        User.findOne({ email }, { _id : 0, trust : 1 }, (err, result) => {
            if(err) {
                console.log(err)
                res.status(500).json({error : 'Internal error please try again'})
            } else if(!result) {
                res.status(401).json({message : 'This user not exist.'}) 
            } else {
                Trust.find({ token : result.trust }, { _id : 0, token : 1, type : 1, price : 1, periodStart : 1, periodEnd : 1, status : 1 }, (err, result) => {
                    if(err) {
                        console.log(err)
                        res.status(500).json({error : 'Internal error please try again'})
                    } else if(!result.length) {
                        res.status(401).json({message : 'This tursts not exist.'}) 
                    } else {
                        res.status(200).json(result)
                    }
                })
            }
        })
    })

// User MaintenanceFee List
router.route('/maintenancefeelist')
    .get(authenticate.user, (req, res) => {
        const email = req.user.permission === "admin" ? req.body.email : req.user.email

        User.findOne({ email }, { _id : 0, maintenanceFee : 1 }, (err, result) => {
            if(err) {
                console.log(err)
                res.status(500).json({error : 'Internal error please try again'})
            } else if(!result) {
                res.status(401).json({message : 'This user not exist.'}) 
            } else {
                MaintenanceFee.find({ electronicPaymentNum : result.maintenanceFee }, { _id : 0, claimingAgency : 1, electronicPaymentNum : 1, dueDate : 1, amountDue : 1 }, (err, result) => {
                    if(err) {
                        console.log(err)
                        res.status(500).json({error : 'Internal error please try again'})
                    } else if(!result.length) {
                        res.status(401).json({message : 'This maintenanceFee not exist.'}) 
                    } else {
                        res.status(200).json(result)
                    }
                })
            }
        })
    })
module.exports = router;