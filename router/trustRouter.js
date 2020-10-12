const router = require('express').Router()
const fs = require("fs")
const { upload, jsonToHash } = require("./utils")

const User = require('../models/User')
const Trust = require('../models/Trust')
const Contract = require('../models/Contract')

const authenticate = require('./passport/authenticate')

// Trust Subscription
router.route('/subscription')
    .post(authenticate.user, (req, res) => {
        upload.array("attachments")(req, res, (err) => {
            if(err) {
                console.log(err)
                res.status(500).json({error : 'Internal error please try again'})
            }
            
            const token = jsonToHash(req.body)

            req.body.token = token
            
            const trustStringData = req.body
            const attachments = new Array()
    
            req.files.forEach((file) => {
                const attachment = {
                    originalName : file.originalname,
                    saveFileName : file.filename,
                    fileSize : file.size,
                    mimeType : file.mimeType,
                    fileBinary : fs.readFileSync(file.path)
                }
                attachments.push(attachment)
            })
    
            const trustData = {
                ...trustStringData,
                attachments
            }
            const trust = new Trust(trustData)
    
            trust.save((err) => {
                if(err){
                    console.log(err)
                    res.status(500).json({error : 'Internal error please try again'})
                } else {
                    req.files.forEach(function(file){
                        fs.unlinkSync(file.path)
                    })

                    const email = req.user.permission === "admin" ? req.body.email : req.user.email

                    User.updateOne({ email }, { $push : { trust : token }}, (err, result) => {
                        if(err) {
                            console.log(err)
                            res.status(500).json({error : 'Internal error please try again'})
                        } else if(!result.n) {
                            res.status(401).json({message : 'This user not exist'})
                        } else {
                            res.status(200).json({message : 'Trust Input Success'})
                        }
                    })
                }
            })
        })
    })
    
// Trust Upload
router.route('/update')
    .post(authenticate.user, (req, res) => {
        upload.array("attachments")(req, res, (err) => {
            if(err) {
                console.log(err)
                res.status(500).json({error : 'Internal error please try again'})
            }

            const token = jsonToHash(req.body)
            
            req.body.token = token

            const trustStringData = req.body
            const attachments = new Array()
    
            req.files.forEach((file) => {
                const attachment = {
                    originalName : file.originalname,
                    saveFileName : file.filename,
                    fileSize : file.size,
                    mimeType : file.mimeType,
                    fileBinary : fs.readFileSync(file.path)
                }
                attachments.push(attachment)
            })
    
            const trustData = {
                ...trustStringData,
                attachments
            }
    
            Trust.updateOne({ token : req.body.preToken }, { $set : trustData }, (err, result) => {
                if(err) {
                    console.log(err)
                    res.status(500).json({error : 'Internal error please try again'})
                } else if(!result.n) {
                    res.status(401).json({messasge : 'This trust not exist.'}) 
                } else {
                    req.files.forEach(function(file){
                        fs.unlinkSync(file.path)
                    })

                    const isKey = 'contract' in result
                    if(isKey) {
                        Contract.updateOne({ token : result.contract }, { trustToken : token }, (err, result) => {
                            if(err) {
                                console.log(err)
                                res.status(500).json({error : 'Internal error please try again'})
                            }
                        })
                    }
                    const email = req.user.permission === "admin" ? req.body.email : req.user.email

                    User.updateOne({ email , trust : req.body.preToken }, { $set : { 'trust.$' : token }}, (err, result) => {
                        if(err) {
                            console.log(err)
                            res.status(500).json({error : 'Internal error please try again'})
                        } else if(!result.n) {
                            res.status(401).json({message : 'This user not exist'})
                        } else {
                            res.status(200).json({message : 'Trust Update Success'})
                        }
                    })
                }
            })
        })
    })

// Trust Delete
router.route('/delete')
    .post(authenticate.user, (req, res) => {
        Trust.deleteOne({ token : req.body.token }, (err, result) => {
            if(err) {
                console.log(err)
                res.status(500).json({error : 'Internal error please try again'})
            } else if(!result.n) {
                res.status(401).json({message : 'This trust not exist.'}) 
            } else {
                const email = req.user.permission === "admin" ? req.body.email : req.user.email

                User.updateOne({ email , trust : req.body.token }, { $pull : { trust : req.body.token }}, (err, result) => {
                    if(err) {
                        console.log(err)
                        res.status(500).json({error : 'Internal error please try again'})
                    } else if(!result.n) {
                        res.status(401).json({message : 'This user not exist.'}) 
                    } else {
                        res.status(200).json({message : 'Trust Delete Success'})
                    }
                })
            }
        })
    })

// Trust Find
router.route('/find')
    .get(authenticate.user, (req, res) => {
        Trust.findOne({ token : req.body.token }, { _id : 0, __v : 0, 'attachments._id' : 0 }, (err, result) => {
            if(err){
                console.log(err)
                res.status(500).json({error : 'Internal error please try again'})
            } else if(!result) {
                res.status(401).json({message : 'This trust not exist.'}) 
            } else {
                res.status(200).json(result)
            }
        })
    })

// Trust List
router.route('/list')
    .get(authenticate.admin, (req, res) => {
        Trust.find({}, { _id : 0, token : 1, type : 1, price : 1, periodStart : 1, periodEnd : 1, status : 1 }, (err, result) => {
            if(err) {
                console.log(err)
                res.status(500).json({error : 'Internal error please try again'})
            } else if(!result.length) {
                res.status(401).json({message : 'This trust not exist.'}) 
            } else {
                res.status(200).json(result)
            }
        })
    })

// Trsut Status Change
router.route('/status')
    .get(authenticate.user, (req, res) => {
        Trust.findOne( { token : req.body.token }, { status : 1 }, (err, result) => {
            if(err){
                console.log(err)
                res.status(500).json({error : 'Internal error please try again'})
            } else if(!result) {
                res.status(401).json({message : 'This trust not exist.'}) 
            } else {
                res.status(200).json(result)
            }
        })
    })

    .post(authenticate.admin, (req, res) => {
        Trust.updateOne( { token : req.body.token }, { $set : { status : req.body.status }}, (err, result) => {
            if(err) {
                console.log(err)
                res.status(500).json({error : 'Internal error please try again'})
            } else if(!result.n) {
                res.status(401).json({message : 'This trust not exist'})
            } else {
                res.status(200).json({message: 'Trust Status Update'})
            }
        })
    })

module.exports = router;