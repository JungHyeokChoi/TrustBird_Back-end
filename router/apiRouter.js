var router = require('express').Router()

const trustRouter = require('./trustRouter')
const userRouter = require('./userRouter')
const contractRouter = require('./contractRouter')
const maintenanceFeeRouter = require('./maintenanceFeeRouter')

router.use('/api/trust', trustRouter)
router.use('/api/user', userRouter)
router.use('/api/contract', contractRouter)
router.use('/api/maintenanceFee', maintenanceFeeRouter)

const ethereumTx = require('./ethereum/ethereumTx')

//65535
// router.route('/test')
//     .get(async(req, res) => {
//         const result = await ethereumTx.getHashValueOfTrust(req.body)

//         console.log(result)

//         if(response.result) res.status(200).json({trusts : response.trusts})
//         else res.sendStatus(401)
//     })
//     .post(async(req, res) => {
//         let response = await ethereumTx.getHashValueOfTrust(req.body)

//         req.body.index = 65535
//         let i = 0
//         for(let trust of response.trusts) {
//             if(!trust) {
//                 req.body.index = i 
//             }
//             i++
//         }
        
//         response = await ethereumTx.addHashValueOfTrust(req.body)

//         if(response) res.sendStatus(200)
//         else res.sendStatus(401)
//     })

    // .get(async(req, res) => {
    //     const response = await ethereumTx.getHashValueOfContract(req.body)

    //     if(response.result) res.status(200).json({contract : response.contract})
    //     else res.sendStatus(401)
    // })
    // .post(async(req, res) => {
    //     const response = await ethereumTx.removeHashValueOfContract(req.body)

    //     if(response) res.sendStatus(200)
    //     else res.sendStatus(401)
    // })

module.exports = router;