var User = require('../models/User')
var router = require('express').Router()

//User SignUp
router.route('/up')
    .post((req, res)=>{
        const userData = req.body
        const user = new User(userData)

        user.save((err)=>{
            if(err){
                console.log(err)
                res.status(500).send("Error sigup new user please try again")
            } else {
                res.status(200).send("Sign Up is Success")
            }
        })
    })

//User SignIn
router.route('/in')
    .post((req, res)=>{
        const { email, password } = req.body

        User.findOne({ email }, (err, result) => {
            if(err) {
                console.log(err)
                res.status(500).json({error : 'Internal error please try again'})
            } else if(!result) {
                console.log(result)
                res.status(401).json({error : 'This user not exist. please using after sign up'})
            } else {
                result.isCorrectPassword(password, (err, same)=>{
                    if(err){
                        console.log(err)
                        res.status(500).json({error : 'Internal error please try again'})
                    } else if (!same) {
                        res.status(401).json({error : 'Incorrect passowrd'})
                    } else {
                        res.sendStatus(200)
                    }
                })
            }
        })
    })

//User SignOut
router.route('/out')
    .get((req, res) => {
        res.sendStatus(200)
    })

//User Modified
router.route('/modified')
    .post((req, res) => {
        User.updateOne({ email:req.body.email }, { $set:req.body }, (err, _) => {
            if(err) {
                console.log(err)
                res.status(500).json({error : 'Database Update fail'})
            } else {
                res.json({Ok: 'Database Update'})
            }
        })
    })

//User Search
router.route('/search')
    .post((req,res) => {
        User.findOne({ email : req.body.email }, (err, result) => {
            if(err) {
                console.log(err)
                res.status(500).json({error : 'Internal error please try again'})
            } else if(!result) {
                console.log(result)
                res.status(401).json({error : 'This user not exist. please using after sign up'})
            } else {
                res.status(200).json(result)
            }
        })
    })

// User Withdrawal
router.route('/withdrawal')
    .get((req, res) => {
        User.deleteOne({ email : req.body.email }, (err, result) => {
            if(err) {
                console.log(err)
                res.status(500).json({error : 'Internal error please try again'})
            } else {
                res.sendStatus(200)
            }
        })
    })

module.exports = router;