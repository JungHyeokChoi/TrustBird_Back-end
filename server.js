const express = require('express')
const bodyParser = require('body-parser')
const cookieParser = require('cookie-parser')
const passport = require('passport')
const cors = require('cors')
const session = require('express-session')

const apiRouter = require('./router/apiRouter')

const app = express()

require('dotenv').config()
require('./router/passport/config').config(passport)

app.use(bodyParser.urlencoded({extended : false}))
app.use(bodyParser.json())
app.use(cookieParser())
app.use(session({
    secret : "To Fill",
    resave : false,
    saveUninitialized : false,
    cookie : {
        httpOnly : true,
        secure : false
    }
}))

app.use(cors({
    origin: true,
    credentials: true,
    methods: 'GET, POST',
}))
app.use(express.static('pubilc'))

//Passport
app.use(passport.initialize())
app.use(passport.session())

//Add Routing File List on Middleware
app.use('/', apiRouter)

//Start Server
PORT=process.env.PORT

app.listen(PORT, () => {
    console.log(`Server is Starting http://localhost:${PORT}`)
})