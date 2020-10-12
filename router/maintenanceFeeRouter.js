const router = require('express').Router()
const fs = require('fs')
const { upload } = require("./utils")

const User = require('../models/User')
const MaintenanceFee = require('../models/MaintenanceFee')

const authenticate = require('./passport/authenticate')

// MaintenanceFee Input
router.route('/input')
    .post(upload.single("giro"), authenticate.admin, (req, res) => {
        const maintenanceFeeStringData = req.body

        const giro = {
            originalName : req.file.originalname,
            saveFileName : req.file.filename,
            fileSize : req.file.size,
            mimetype : req.file.mimetype,
            fileBinary : fs.readFileSync(req.file.path)
        }

        const maintenanceFeeData = {
            ...maintenanceFeeStringData,
            giro
        }
        
        const maintenanceFee = new MaintenanceFee(maintenanceFeeData)

        maintenanceFee.save((err) => {
            if(err) {
                console.log(err)
                res.status(500).json({error : 'Internal error please try again'})
            } else {
                fs.unlinkSync(req.file.path)
                User.updateOne({ email : req.body.userEmail }, { $push : { maintenanceFee : req.body.electronicPaymentNum }}, (err, result) => {
                    if(err) {
                        console.log(err)
                        res.status(500).json({error : 'Internal error please try again'})
                    } else if(!result.n) {
                        res.status(401).json({message : 'This user not exist'})
                    } else {
                        res.status(200).json({message : 'MaintenanceFee Input Success'})
                    }
                })
            }
        })
    })

// MaintenanceFee Update
router.route('/update')
    .post(upload.single("giro"), authenticate.admin, (req, res) => {
        const maintenanceFeeStringData = req.body
        const giro = {
            originalName : req.file.originalname,
            saveFileName : req.file.filename,
            fileSize : req.file.size,
            mimetype : req.file.mimetype,
            fileBinary : fs.readFileSync(req.file.path)
        }

        const maintenanceFeeData = {
            ...maintenanceFeeStringData,
            giro
        }

        MaintenanceFee.updateOne({ electronicPaymentNum : req.body.electronicPaymentNum }, { $set : maintenanceFeeData }, (err, result) => {
            if(err) {
                console.log(err)
                res.status(500).json({error : 'Internal error please try again'})
            } else if(!result.n) {
                res.status(401).json({message : 'This maintenanceFee not exist'})
            } else {
                fs.unlinkSync(req.file.path)
                res.status(200).json({message : 'MaintenanceFee Update Success'})
            }
        })
    })

// MaintenanceFee Delete
router.route('/delete')
    .post(authenticate.admin, (req, res) => {
        MaintenanceFee.deleteOne({ electronicPaymentNum : req.body.electronicPaymentNum }, (err, result) => {
            if(err) {
                console.log(err)
                res.status(500).json({error : 'Internal error please try again'})
            } else if(!result.n) {
                res.status(401).json({message : 'This maintenanceFee not exist'})
            } else {
                User.updateOne({ email : req.body.userEmail, maintenanceFee : req.body.electronicPaymentNum }, { $pull : { maintenanceFee : req.body.electronicPaymentNum }}, (err, result) => {
                    if(err) {
                        console.log(err)
                        res.status(500).json({error : 'Internal error please try again'})
                    } else if(!result.n) {
                        res.status(401).json({message : 'This user not exist.'}) 
                    } else {
                        res.status(200).json({message : 'MaintenanceFee Delete Success'})
                    }
                })
            }
        })
    })

// MaintenanceFee Find
router.route('/find')
    .get(authenticate.user, (req, res) => {
        MaintenanceFee.findOne({ electronicPaymentNum : req.body.electronicPaymentNum }, { _id : 0, __v : 0 },(err, result) => {
            if(err) {
                console.log(err)
                res.status(500).json({error : "Internal error please try again"})
            } else if(!result) {
                res.status(401).json({message : 'This maintenanceFee not exist'})
            } else {
                res.status(200).json(result)
            }
        })

    })

// MaintenanceFee List
router.route('/list')
    .get(authenticate.admin,(req, res) => {
        MaintenanceFee.find({}, { _id : 0, claimingAgency : 1, electronicPaymentNum : 1, dueDate : 1, amountDue : 1 }, (err, result) => {
            if(err) {
                console.log(err)
                res.status(500).json({error : "Internal error please try again"})
            } else if(!result.length) {
                res.status(401).json({message : 'This maintenanceFees not exist'})
            } else {
                res.status(200).json(result)
            }
        })
    })

module.exports = router;
