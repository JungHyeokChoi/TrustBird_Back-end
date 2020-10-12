const LocalStrategy = require('passport-local').Strategy
const User = require('../../models/User')

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
    
    passport.use(new LocalStrategy({ usernameField : 'email', passwordField : 'password', session : true }, (email, password, done) => {
        User.findOne({ email }, (err, user) => {
            if(err) {
                done(err)
            } else if(!user) {
                done(null, false, {message : 'This user not exist'}) 
            } else if(!user.isCorrectPassword(password)){
                done(null, false, {message : "Invaild username password"})
            } else {
                done(null, user) 
            }
        })
    }))
}
