var MaintenanceFee = require('../models/MaintenanceFee')
var router = require('express').Router()



// 관리비내역출력
router.route('/maintenancefee')
    .get((req, res, next) => {

        const mainFeeData = req.body

        MaintenanceFee.findOne((mainFeeData), (err, result)=>{
            if(err){
                console.log(err)
                res.status(500).send("Internal error please try again")
            } else {
                res.sendStatus(200)
                console.log(result)
            }
        })

    })

// 관리비내역리스트 빈라우터 => 저장 테스트를 위해 제작
router.route('/maintenancefeelist')
    .post((req, res, next) => {

        const mainFeeData = req.body

        const mainFee = new MaintenanceFee(mainFeeData)
        
        mainFee.save((err)=>{
            if(err){
                console.log(err)
                res.status(500).send("Internal error please try again")
            } else {
                res.status(200).send("Fail")
            }
        })
    })

module.exports = router;
