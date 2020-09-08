var express = require('express')
var bodyParser = require('body-parser')
var cookieParser = require('cookie-parser')
var passport = require('passport')
var mongoose = require('mongoose')
var cors = require('cors')
var session = require('express-session')

require('dotenv').config()

var app = express()

app.use(bodyParser.urlencoded({extended : false}))
app.use(bodyParser.json())
app.use(cookieParser())
app.use(session({
    secret : "To Fill",
    resave : true,
    saveUninitialized : true
}))
app.use(cors())

//Connection Mongo DB
mongoose.connect(process.env.MONGO_URI, {useNewUrlParser: true, useUnifiedTopology: true}, (err) => {
    if(err) console.log(err)
    else console.log('DB Connected')
})

//Passport
app.use(passport.initialize())
app.use(passport.session())
passport.serializeUser((user, done) => {
    done(null, user._id)
})

passport.deserializeUser((userId, done) => {
    User.findById(userId, (err, result) => { done(err, result) })
})

const LocalStrategy = require('passport-local').Strategy
const local = new LocalStrategy((username, password, done) => {
    User.findOne({ username })
    .then(user => {
        if(!user || !user.validPassword(password)){
            done(null, false, {message : "Invaild username password"})
        } else {
            done(null, user) 
        }
    })
    .catch(e => done(e))
})
passport.use("local", local)

//Add Routing File List on Middleware
app.use('/', apiRouter(passport))

//Start Server
PORT=process.env.PORT

app.listen(PORT, () => {
    console.log(`Server is Starting http://localhost:${PORT}`)
})