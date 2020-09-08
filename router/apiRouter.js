var router = require('express').Router()

router.route('/')
    .get((req, res, next) => {
        res.send("Success")
    })

module.exports = router;