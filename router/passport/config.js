const passportJWT = require('passport-jwt');
const LocalStrategy = require('passport-local').Strategy
const JWTStrategy   = passportJWT.Strategy;
const ExtractJWT = passportJWT.ExtractJwt;

const { isCorrectPassword } = require('../utils')

const userTx = require('../hyperledger_fabric/userTx')
const { wallet } = require('../hyperledger_fabric/utils')


exports.config = (passport) => {
    passport.serializeUser((user, done) => {
        done(null, user)
    })

    passport.deserializeUser((user, done) => {
        done(null, user)
    })

    passport.use(new LocalStrategy({ usernameField : 'email', passwordField : 'password', session : true }, async(email, password, done) => {
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

    passport.use(new JWTStrategy({jwtFromRequest: ExtractJWT.fromAuthHeaderAsBearerToken(), secretOrKey : process.env.JWT_SECRET_KEY}, (jwtPayload, done) => {
        if(jwtPayload) {
            done(null, jwtPayload)
        } else {
            done(null, {message : "The token does not exist."})
        }
    }
));
}
