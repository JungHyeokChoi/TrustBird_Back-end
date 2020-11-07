/*
    supervisor : 관라자
    legarTL : 법무팀장
    maintenanceTL : 시설팀장
    accountingTL 회계팀장
    warrantyServieceTL : 사후관리팀장
    pointManager : 포인트관리자
*/

const passport = require('passport')

const admin = (req, res, next) => {
    verifyToken(req, res, next)

    if(req.user){
        if(req.user.permission !== 'user') {
            next()
        } else {
            res.status(401).json({message : 'Invaild Authority'})
        }
    } else {
        res.status(401).json({message : 'You are not sign in. please using after sign in'})
    }
}

const user = (req, res, next) => {
    verifyToken(req, res, next)

    if(req.user){
        next()
    } else {
        res.status(401).json({message : 'You are not sign in. please using after sign in'})
    }
}

const verifyToken = (req, res, next) => {
    return passport.authenticate('jwt', { session : false }, (err, user) => {
        if(err) {
            console.log(err)
            return next(err)
        }
        if(!user) {
            return res.status(401).json({message : 'The user does not exist.' })
        }

        req.user = user
    })(req, res, next)
}

module.exports = {
    admin,
    user
};