var router = require('express').Router()

const trustRouter = require('./trustRouter')
const signRouter = require('./signRouter')
const contractRouter = require('./contractRouter')
const maintenanceFeeRouter = require('./maintenanceFeeRouter')

router.use('/api/trust', trustRouter)
router.use('/api/sign', signRouter)
router.use('/api/contract', contractRouter)
router.use('/api/maintenanceFee', maintenanceFeeRouter)

module.exports = router;