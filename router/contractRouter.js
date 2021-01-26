const router = require('express').Router()
const fs = require('fs')
const { upload, jsonToHash } = require('./utils')

const Contract = require('../models/Contract')
const Trust = require('../models/Trust')

const authenticate = require('./passport/authenticate')

// Contract Enroll
router.route('/enroll')
    .post(authenticate.admin, (req, res) => {
        upload.array("attachments")(req, res, (err) => {
            if(err) {
                console.log(err)
                res.status(500).json({error : 'Internal error please try again'})
            }

            const token = jsonToHash(req.body)

            req.body.token = token

            const contractStringData = req.body
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
    
            const contractData = {
                ...contractStringData,
                attachments
            }

            const contract = new Contract(contractData)

            contract.save((err)=>{      
                if(err){
                    console.log(err)
                    res.status(500).json({error : 'Internal error please try again'})
                } else {
                    req.files.forEach(function(file){
                        fs.unlinkSync(file.path)
                    })

                    Trust.updateOne({ token : req.body.trustToken }, { $set : { contract : token }}, (err, result) => {
                        if(err) {
                            console.log(err)
                            res.status(500).json({error : 'Internal error please try again'})
                        } else if(!result.n) {
                            res.status(401).json({message : 'This user not exist'})
                        } else {
                            res.status(200).json({message : 'Contract Enroll Success'})
                        }
                    })
                }
            })
        })
    })

// Contract Update
router.route('/update')
    .post(authenticate.admin, (req, res) => {
        upload.array("attachments")(req, res, (err) => {
            if(err) {
                console.log(err)
                res.status(500).json({error : 'Internal error please try again'})
            }
            
            const token = jsonToHash(req.body)
            
            req.body.token = token

            const contractStringData = req.body
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
    
            const contractData = {
                ...contractStringData,
                attachments
            }

            Contract.updateOne({ token : req.body.preToken }, { $set : contractData }, (err, result) => {
                if(err) {
                    console.log(err)
                    res.status(500).json({error : 'Internal error please try again'})
                } else if(!result.n) {
                    res.status(401).json({messasge : 'This contract not exist.'}) 
                } else {
                   req.files.forEach(function(file){
                        fs.unlinkSync(file.path)
                    })

                    Trust.updateOne({ token : req.body.trustToken }, { $set : { contract : token }}, (err, result) => {
                        if(err) {
                            console.log(err)
                            res.status(500).json({error : 'Internal error please try again'})
                        } else if(!result.n) {
                            res.status(401).json({message : 'This user not exist'})
                        } else {
                            res.status(200).json({message : 'Contract Enroll Success'})
                        }
                    })

                    res.status(200).json({message: 'Contract Update Success'})
                }
            })
        })
    })

// Contract Delete
router.route('/delete')
    .post(authenticate.admin, (req, res) => {
        Contract.deleteOne({ token : req.body.token }, (err, result) => {
            if(err) {
                console.log(err)
                res.status(500).json({error : 'Internal error please try again'})
            } else if(!result.n) {
                res.status(401).json({message : 'This contract not exist.'}) 
            } else {
                Trust.updateOne({ token : req.body.trustToken }, { $unset : { contract : "" }}, (err, result) => {
                    if(err) {
                        console.log(err)
                        res.status(500).json({error : 'Internal error please try again'})
                    } else if(!result.n) {
                        res.status(401).json({message : 'This user not exist.'}) 
                    } else {
                        res.status(200).json({message : 'Contract Delete Success'})
                    }
                })
            }
        })
    })

// Contract Find
router.route('/find')
    .get(authenticate.user, (req, res) => {
        Contract.findOne({ token : req.body.token }, { _id : 0, __v : 0, 'attachments._id' : 0 }, (err, result) => {
            if(err){
                console.log(err)
                res.status(500).json({error : 'Internal error please try again'})
            } else if(!result) {
                res.status(401).json({message : 'This contract not exist.'}) 
            } else {
                res.status(200).json(result)
            }
        })
    })

// Contract List
router.route('/list')
    .get(authenticate.admin, (req, res) => {
        Contract.find({}, { _id : 0, token : 1, location : 1, rentType : 1, periodStart : 1, periodEnd : 1 }, (err, result) => {
            if(err) {
                console.log(err)
                res.status(500).json({error : 'Internal error please try again'})
            } else if(!result.length) {
                res.status(401).json({message : 'This contract not exist.'}) 
            } else {
                res.status(200).json(result)
            }
        })
    })

module.exports = router;