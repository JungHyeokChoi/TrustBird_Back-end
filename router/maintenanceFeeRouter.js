var MaintenanceFee = require('../models/MaintenanceFee')
var router = require('express').Router()

// MaintenanceFee Input
router.route('/input')
    .post((req, res) => {
        const maintenanceFeeData = req.body
        const maintenanceFee = new MaintenanceFee(maintenanceFeeData)

        maintenanceFee.save((err) => {
            if(err) {
                console.log(err)
                res.status(500).send("Internal error please try again")
            } else {
                res.status(200).send("Input Success")
            }
        })
    })

// MaintenanceFee Find
router.route('/find')
    .get((req, res) => {
        MaintenanceFee.findOne({ electronicPaymentNum : req.body.electronicPaymentNum }, (err, result) => {
            if(err) {
                console.log(err)
                res.status(500).send("Internal error please try again")
            } else {
                res.status(200).json(result)
            }
        })

    })

// MaintenanceFee Find All
router.route('/findAll')
    .get((req, res) => {
        MaintenanceFee.find({}, (err, result) => {
            if(err) {
                console.log(err)
                res.status(500).send("Internal error please try again")
            } else {
                res.status(200).json(result)
            }
        })
    })

module.exports = router;
