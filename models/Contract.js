var Contract = require('../models/Contract')
var router = require('express').Router()


// 계약서 출력
router.route('/contract')
    .post((req, res, next) => {

        const contractData = req.body

        Contract.findOne((contractData), (err, result)=>{
            if(err){
                console.log(err)
                res.status(500).send("Internal error please try again")
            }else{
            console.log(result)
            res.sendStatus(200)
            }
        })
    })

// 계약서 등록
router.route('/contractenroll')
    .post((req, res, next) => {

        const contractData = req.body

        const contract = new Contract(contractData)

        contract.save((err)=>{      
            if(err){
                console.log(err)
                res.status(500).send("Internal error please try again")
            } else {
                res.status(200).send("Sign Up is Success")
            }
        })

    })

router.route('/contractlist')
    .get((req, res, next) => {
        res.sendStatus(200)
    })

module.exports = router;
