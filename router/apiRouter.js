var User = require('../models/User')
const crypto = require('crypto')
var router = require('express').Router()

//Router 분활
const trustRouter = require('./trustRouter')

const signRouter = require('./signRouter')

const contractRouter = require('./contractRouter')

const mainfeeRouter = require('./maintenanceFeeRouter')

router.use('/trustapi', trustRouter)
router.use('/signapi', signRouter)
router.use('/contractapi', contractRouter)
router.use('/mainfeeapi', mainfeeRouter)

// hashing 함수
router.route('/api/hash')
    .post((req, res, next)=>{
        const { username, password, email, dateOfBirth, gender, telephoneNum } = req.body

        User.findOne({ username, password, email, dateOfBirth, gender, telephoneNum }, ()=>{

            var userDate = (username + password + email + dateOfBirth + gender + telephoneNum)
            console.log(userDate)
            var crytoDB = crypto.createHash('sha256').update(userDate).digest('hex')
            console.log(crytoDB)
            res.sendStatus(200)
    })
})

module.exports = router;