/*
    supervisor : 관라자
    legarTL : 법무팀장
    maintenanceTL : 시설팀장
    accountingTL 회계팀장
    warrantyServieceTL : 사후관리팀장
    pointManager : 포인트관리자
*/

const admin = (req, res, next) => {
    if(req.isAuthenticated()){
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
    if(req.isAuthenticated()){
        next()
    } else {
        res.status(401).json({message : 'You are not sign in. please using after sign in'})
    }
}

module.exports = {
    admin,
    user
};