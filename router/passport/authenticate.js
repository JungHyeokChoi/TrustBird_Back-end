const admin = (req, res, next) => {
    if(req.isAuthenticated()){
        if(req.user.permission === 'admin') {
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