const LocalStrategy = require('passport-local').Strategy
const { isCorrectPassword } = require('../utils')

const userTx = require('../hyperledger_fabric/userTx')
const { wallet } = require('../hyperledger_fabric/utils')


exports.config = (passport) => {
    passport.serializeUser((user, done) => {
        const result = {
            email : user.email,
            permission : user.permission
        }
        done(null, result)
    })
    
    passport.deserializeUser((user, done) => {
        done(null, user)
    })
    
    passport.use('local', new LocalStrategy({ usernameField : 'email', passwordField : 'password', session : true }, async(email, password, done) => {
        const User = await wallet('user')

        const request = {
            gateway : User.gateway,
            contract : User.contract,
            email : email
        }

        const response = await userTx.readUser(request)
        
        if(!response.result){
            done(response.error)
        } else if (response.user.email !== email) {
            done(null, false, {message : 'This user not exist'}) 
        } else if(!isCorrectPassword(password, response.user.password)) {
            done(null, false, {message : "Invaild username password"})
        } else {
            done(null, response.user) 
        }
    }))
}
