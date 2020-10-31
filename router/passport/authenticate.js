/*
    supervisor : 관라자
    legarTL : 법무팀장
    maintenanceTL : 시설팀장
    accountingTL 회계팀장
    warrantyServieceTL : 사후관리팀장
    pointManager : 포인트관리자
*/

const jwt = require('jsonwebtoken')

const admin = (req, res, next) => {
    const user = verifyToken(req.cookies.user)
    
    if(user){
        if(user.permission !== 'user') {
            req.user = user
            next()
        } else {
            res.status(401).json({message : 'Invaild Authority'})
        }
    } else {
        res.status(401).json({message : 'You are not sign in. please using after sign in'})
    }
}

const user = (req, res, next) => {
    const user = verifyToken(req.cookies.user)

    if(user){
        req.user = user

        next()
    } else {
        res.status(401).json({message : 'You are not sign in. please using after sign in'})
    }
}

const verifyToken = (clientToken) => {
    try {
        const decoded = jwt.verify(clientToken, process.env.JWT_SECRET_KEY);

        if (decoded) {
            return decoded
        } else {
            res.status(401).json({ error: 'Unauthorized' });
        }
    } catch (err) {
        res.status(401).json({ error: 'Token expired' });
    }
}

module.exports = {
    admin,
    user
};