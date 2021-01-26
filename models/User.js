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
        type : Date
    },

    gender : {
        type : String
    },

    telephoneNum : {
        type : String
    },

    permission : {
        type : String,
        default : "User"
    },

    membership : {
        type : Number,
        default : 0
    },

    balance : {
        type : Number,
        default : 0
    },

    trust : [{
        type : String
    }],

    maintenanceFee : [{
        type : String
    }],
})

UserSchema.pre('save', function(next) {
    const document = this

    if(this.isNew || this.isModified('password')) {
        bcrypt.hash(this.password, 10, function(err, hashedPassword) {
            if(err) {
                next(err)
            } 
            else {
                document.password = hashedPassword
                next()
            }
        })
    } else {
        next()
    }
})

UserSchema.pre('updateOne', function() {
    if(this._update.$set) {
        if(this._update.$set.password) {
            const hashedPassword = bcrypt.hashSync(this._update.$set.password, 10)
            this._update.$set.password = hashedPassword
        }
    }
})

UserSchema.methods.isCorrectPassword = function(password) {
    return bcrypt.compareSync(password, this.password)
}

module.exports = mongoose.model('User', UserSchema)