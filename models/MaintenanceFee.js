var mongoose = require('mongoose')

//Maintenance Fee Data
var maintenanceFeeSchema = new mongoose.Schema({
    claimingAgency : {
        type : String,
        required : true
    },

    electronicPaymentNum : {
        type : Number,
        required : true
    },

    dueDate : {
        type : Date,
        required : true
    },

    deadline : {
        type : Date,
        required : true
    },

    amountDue : {
        type : Number,
        required : true
    },

    amountDeadline : {
        type : Number,
        required : true
    },

    payment : {
        type : String
    },

    payer : {
        type : String
    },

    giro : {
        originalName : String,
        saveFileName : String,
        fileSize : String,
        mimeType : String,
        fileBinary : Buffer
    }

})

module.exports = mongoose.model('MaintenanceFee', maintenanceFeeSchema)