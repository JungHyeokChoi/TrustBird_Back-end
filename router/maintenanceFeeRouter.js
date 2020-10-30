const router = require('express').Router()

const { upload, selectProperties } = require('./utils')
const { wallet } = require('./hyperledger_fabric/utils')

const ipfs = require('./ipfs/ipfs')

const userTx = require('./hyperledger_fabric/userTx')
const maintenanceFeeTx = require('./hyperledger_fabric/maintenanceFeeTx')

const authenticate = require('./passport/authenticate')

// MaintenanceFee Input
router.route('/input')
    .post(upload.single('giro'), authenticate.admin, async(req, res) => {
        console.log('MaintenanceFee Input...')

        const { filePath, fileName } = await ipfs.add({
            name : req.file.originalname,
            path : req.file.path,
            savePath : `maintenanceFee/${req.body.email}`
        })

        const MaintenanceFee = await wallet('maintenanceFee')

        const maintenanceFeeRequest = {
            contract : MaintenanceFee.contract,
            claimingAgency : req.body.claimingAgency,
            electronicPaymentNum : req.body.electronicPaymentNum,
            dueDate : req.body.dueDate,
            deadline : req.body.deadline,
            amountDue : req.body.amountDue,
            amountDeadline : req.body.amountDeadline,
            payment : req.body.payment,
            payer : req.body.payer,
            fileName : fileName,
            filePath : filePath
        }

        let result = await maintenanceFeeTx.addMaintenanceFee(maintenanceFeeRequest)
        
        if (!result) {
            res.status(500).json({error : 'Internal error please try again'})
        } else {
            const User = await wallet('user')

            const userRequest = {
                contract : User.contract,
                email : req.body.email,
                targetAttr : 'MaintenanceFee',
                value : req.body.electronicPaymentNum
            }

            result = await userTx.addAttribute(userRequest)

            if(result) {
                res.status(200).json({message : 'MaintenanceFee Input Success'})
            } else {
                res.status(500).json({error : 'Internal error please try again'})
            }
        }
    })

// MaintenanceFee Update
router.route('/update')
    .post(upload.single('giro'), authenticate.admin, async(req, res) => {
        console.log('MaintenanceFee Update...')

        const { filePath, fileName } = await ipfs.add({
            name : req.file.originalname,
            path : req.file.path,
            savePath : `maintenanceFee/${req.body.email}`
        })

        const MaintenanceFee = await wallet('maintenanceFee')

        const request = {
            contract : MaintenanceFee.contract,
            claimingAgency : req.body.claimingAgency,
            electronicPaymentNum : req.body.electronicPaymentNum,
            dueDate : req.body.dueDate,
            deadline : req.body.deadline,
            amountDue : req.body.amountDue,
            amountDeadline : req.body.amountDeadline,
            payment : req.body.payment,
            payer : req.body.payer,
            fileName : fileName,
            filePath : filePath
        }

        const result = await maintenanceFeeTx.updateMaintenanceFee(request)

        if (!result) {
            res.status(500).json({error : 'Internal error please try again'})
        } else {
            res.status(200).json({message : 'MaintenanceFee Update Success'})
        }
    })

// MaintenanceFee Delete
router.route('/delete')
    .post(authenticate.admin, async(req, res) => {
        console.log('MaintenanceFee Delete...')

        const MaintenanceFee = await wallet('maintenanceFee')

        const maintenanceFeeRequest = {
            contract : MaintenanceFee.contract,
            electronicPaymentNum : req.body.electronicPaymentNum
        }

        let result = await maintenanceFeeTx.removeMaintenanceFee(maintenanceFeeRequest)
        
        if(!result) {
            res.status(500).json({error : 'Internal error please try again'})
        } else {
            const User = await wallet('user')

            const userRequest = {
                contract : User.contract,
                email : req.body.email,
                targetAttr : 'MaintenanceFee',
                value : req.body.electronicPaymentNum
            }

            result = await userTx.removeAttribute(userRequest)

            if(result) {
                res.status(200).json({message : 'MaintenanceFee Delete Success'})
            } else {
                res.status(500).json({error : 'Internal error please try again'})
            }
        }
    })

// MaintenanceFee Find
router.route('/find')
    .get(authenticate.user, async(req, res) => {    
        console.log('MaintenanceFee Find...')

        const MaintenanceFee = await wallet('maintenanceFee')

        const request = {
            contract : MaintenanceFee.contract,
            electronicPaymentNum : req.query.electronicPaymentNum
        }

        const response = await maintenanceFeeTx.readMaintenanceFee(request)

        if (!response.result) {
            console.log(response.error)
            res.status(500).json({error : 'Internal error please try again'})
        } else if(response.maintenanceFee === undefined) { 
            res.status(401).json({message : 'This maintenanceFee not exist'})
        } else {
            res.status(200).json(response.maintenanceFee)
        }
    })

// MaintenanceFee List
router.route('/list')
    .get(authenticate.admin, async(req, res) => {
        console.log('MaintenanceFee List...')

        const MaintenanceFee = await wallet('maintenanceFee')

        const request = {
            contract : MaintenanceFee.contract
        }

        const response = await maintenanceFeeTx.readAllMaintenanceFee(request)

        if (!response.result) {
            console.log(response.error)
            res.status(500).json({error : 'Internal error please try again'})
        } else if(response.maintenanceFees === undefined) { 
            res.status(401).json({message : 'This maintenanceFee not exist'})
        } else {
            const projection = {
                claimingAgency : 1,
                electronicPaymentNum : 1,
                dueDate : 1,
                amountDue : 1
            }
            
            for(let maintenanceFee of response.maintenanceFees){
                selectProperties(maintenanceFee, projection)
            }

            res.status(200).json(response.maintenanceFees)
        }
    })

module.exports = router;
