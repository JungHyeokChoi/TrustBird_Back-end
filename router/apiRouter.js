var router = require('express').Router()

const trustRouter = require('./trustRouter')
const userRouter = require('./userRouter')
const contractRouter = require('./contractRouter')
const maintenanceFeeRouter = require('./maintenanceFeeRouter')

router.use('/api/trust', trustRouter)
router.use('/api/user', userRouter)
router.use('/api/contract', contractRouter)
router.use('/api/maintenanceFee', maintenanceFeeRouter)

module.exports = router;