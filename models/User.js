var mongoose = require('mongoose')
var bcrypt = require('bcryptjs')

//User Data
var UserSchema = new mongoose.Schema({
    username : {
        type : String,
        required : true 
    },

    email : {
        type : String,
        required : true
    },

    password : {
        type : String,
        required : true
    },

    dateOfBirth : {
        type : Date,
        required : true,
    },

    gender : {
        type : String,
        required : true
    },

    telephoneNum : {
        type : String,
        required : true
    }
})

UserSchema.pre('save', function(next){
    const document = this

    if(this.isNew || this.isModified('password')){
        bcrypt.hash(this.password, 10, function(err, hashedPassword){
            if(err){
                next(err)
            } 
            else {
                document.password = hashedPassword}
                next()
            }
        )
    } else {
        next()
    }
})

UserSchema.methods.isCorrectPassword = function(password, callback) {
    bcrypt.compare(password, this.password, function(err, same){
        if(err) {
            callback(err)
        } else {
            callback(err, same)
        } 
    })
}

module.exports = mongoose.model('User', UserSchema)