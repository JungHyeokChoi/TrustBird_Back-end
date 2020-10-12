var router = require('express').Router()

const trustRouter = require('./trustRouter')
const userRouter = require('./userRouter')
const contractRouter = require('./contractRouter')
const maintenanceFeeRouter = require('./maintenanceFeeRouter')

router.use('/api/trust', trustRouter)
router.use('/api/user', userRouter)
router.use('/api/contract', contractRouter)
router.use('/api/maintenanceFee', maintenanceFeeRouter)

// For Development
const User = require('../models/User')
const Trust = require('../models/Trust')
const Contract = require('../models/Contract')
const MaintenanceFee = require('../models/MaintenanceFee')

router.route('/allclean')
    .get(async (req, res) => {
        await User.remove({})
        await Trust.remove({})
        await Contract.remove({})
        await MaintenanceFee.remove({})
        
        res.json({message : 'All clean'})
    })

module.exports = router;