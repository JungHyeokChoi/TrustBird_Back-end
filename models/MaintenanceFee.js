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
        type : String,
        required : true
    },

    payer : {
        type : String,
        required : true
    },

    giro : {
        type : String,
        required : false
    }

})

module.exports = mongoose.model('MaintenanceFee', maintenanceFeeSchema)