var mongoose = require('mongoose')

//Contract Data
var contractSchema = new mongoose.Schema({
    newToken : {
        type : String,
        required : true
    },

    preToken : {
        type : String,
        required : true
    },

    location : {
        type : String,
        required : true
    },

    landCategory : {
        type : String,
        required : true
    },

    landArea : {
        type : Number,
        required : true
    },

    buildingPurpose : {
        type : String,
        required : true
    },

    buildingArea : {
        type : Number,
        required : true
    },

    partOfLease : {
        type : String,
        required : true
    },

    partOfLeaseArea : {
        type : Number,
        required : true
    },

    rentType : {
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

    securityDeposit : {
        type : Number,
        required : true
    },

    contractPrice : {
        type : Number,
        required : false
    },

    interimPrice : {
        type : Number,
        required : false
    },

    balance : {
        type : Number,
        required : false
    },

    rent : {
        type : Number,
        required : false
    },

    specialAgreement : {
        type : String,
        required : false
    },

    lessor : {
        address : { type : String, 
                    required : true 
                },
        RRN : {
            type : String,
            required : true
        },
        name : {
            type : String,
            required : true
        },
        telephoneNum : {
            type : String,
            required : true
            }
    },

    lessee : {
        address : { 
            type : String, 
            required : true 
        },
        RRN : {
            type : String,
            required : true
        },
        name : {
            type : String,
            required : true
        },
        telephoneNum : {
            type : String,
            required : true
        }
    },

    realtor : {
        address : { 
            type : String, 
            required : true 
                },
        officeName : {
            type : String,
            required : true
        },
        name : {
            type : String,
            required : true
        },
        registrationNum : {
            type : String,
            required : true
        },
        telephoneNum : {
            type : String,
            required : true
        },
    }
})

module.exports = mongoose.model('Contract', contractSchema)