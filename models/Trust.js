var mongoose = require('mongoose')

//Trust Data
var trustSchema = new mongoose.Schema({
    token : {
        type : String,
        required : true
    },

    preToken : {
        type : String
    },

    username : {
        type : String,
        required : true
    },

    telephoneNum : {
        type : String,
        required : true
    },

    realtorName : {
        type : String,
        required : true
    },

    realtorTelephoneNum : {
        type : String,
        required : true
    },

    realtorCellphoneNum : {
        type : String,
        required : true
    },

    type : {
        type : String,
        required : true
    },

    securityDeposit : {
        type : Number,
        required : true
    },

    rent : {
        type : Number
    },

    purpose : {
        type : String,
        required : true
    },

    periodStart : {
        type : Date,
        required : true
    },

    periodEnd : {
        type : Date,
        required : true
    },
    
    etc : {
        type : String
    },

    attachments : [
        new mongoose.Schema({
            originalName : String,
            saveFileName : String,
            fileSize : String,
            mimeType : String,
            fileBinary: Buffer
        })
    ],

    status : {
        type : String,
        default : "신탁 요청"
    },

    contract : {
        type : String
    }
})

module.exports = mongoose.model('Trust', trustSchema)