// 'use strict';

const maintenanceFeeTx = {
    addMaintenanceFee : async(request) => {
        try {
            await request.contract.createTransaction('addMaintenanceFee')
            .submit(
                request.email,
                request.claimingAgency,
                request.electronicPaymentNum,
                request.dueDate,
                request.amountDue,
                request.amountDeadline,
                request.payment,
                request.payer,
                request.fileName,
                request.filePath
            )

            return true

        } catch(error) {
            console.log(error)

            return {
                result : false,
                error : error
            }
        }
        
    },

    updateMaintenanceFee : async(request) => {
        try {
            await request.contract.createTransaction('updateMaintenanceFee')
            .submit(
                request.email,
                request.claimingAgency,
                request.electronicPaymentNum,
                request.dueDate,
                request.amountDue,
                request.amountDeadline,
                request.payment,
                request.payer,
                request.fileName,
                request.filePath
            )

            return true

        } catch(error) {
            console.log(error)

            return {
                result : false,
                error : error
            }
        }
        
    },
               
    removeMaintenanceFee : async(request) => {
        try {
            await request.contract.createTransaction('removeMaintenanceFee')
            .submit(
                request.electronicPaymentNum
            )
            
            return true

        } catch(error) {
            console.log(error)

            return false
        }
       
    },

    readMaintenanceFee : async(request) => {
        const result = await request.contract.createTransaction('readMaintenanceFee')
        .evaluate( 
            request.electronicPaymentNum
        )

        if (result.length == 0) {
            return { 
                result : true 
            }  
        } 

        return { 
            result : true,
            maintenanceFee : JSON.parse(result)
        }
    },

    readAllMaintenanceFee : async(request) => {
        const result = await request.contract.createTransaction('readAllMaintenanceFee')
        .evaluate()

        if (result.length == 0) {
            return { 
                result : true 
            }  
        } 

        return { 
            result : true,
            maintenanceFees : JSON.parse(result)
        }
    }
}

            
module.exports = maintenanceFeeTx