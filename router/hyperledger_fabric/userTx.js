'use strict';

const userTx = {
    addUser : async(request) => {
        try {
            await request.contract.createTransaction('addUser')
            .submit(
                request.username,
                request.email,
                request.password,
                request.dateOfBirth,
                request.gender,
                request.telephoneNum,
                request.permission,
                request.membership,
                request.balance
            )

            return true

        } catch(error) {
            console.log(error)

            return false
        }
    },

    updateUser : async(request) => {
        try{
            await request.contract.createTransaction('updateUser')
            .submit(
                request.username,
                request.email,
                request.password,
                request.dateOfBirth,
                request.gender,
                request.telephoneNum,
                request.permission,
                request.membership,
                request.balance
            )

            return true
            
        } catch(error) {
            console.log(error)

            return false
        }
    },

    removeUser : async(request) => {
        try {
            await request.contract.createTransaction('removeUser')
            .submit(
                request.email
            )

            return true
            
        } catch(error) {
            console.log(error)

            return false
        }
    },

    readUser : async(request) => {
        try {
            const result = await request.contract.createTransaction("readUser")
            .evaluate(
                request.email
            )

            if (result.length == 0) {
                return { 
                    result : true 
                }  
            } 

            return {
                result : true,
                user : JSON.parse(result)
            }
            
        } catch(error) {
            console.log(error)

            return {
                result : false,
                error : error
            }
        }
    },

    readAllUser : async(request) => {
        try {
            const result = await request.contract.createTransaction("readAllUser")
            .evaluate()

            if (result.length == 0) {
                return { 
                    result : true 
                }  
            } 

            return { 
                result : true,
                users : JSON.parse(result)
            }
            
        } catch(error) {
            console.log(error)

            return {
                result : false,
                error : error
            }
        }
    },

    addAttribute : async(request) => {
        try {
            await request.contract.createTransaction('addAttribute')
            .submit(
                request.email,
                request.targetAttr,
                request.value
            )

            return true
            
        } catch(error) {
            console.log(error)

            return false
        }
    },

    updateAttribute : async(request) => {
        try {
            await request.contract.createTransaction('updateAttribute')
            .submit(
                request.email,
                request.targetAttr,
                request.preValue,
                request.newValue
            )
            
            return true
            
        } catch(error) {
            console.log(error)

            return false
        }
    },

    removeAttribute : async(request) => {
        try {
            await request.contract.createTransaction('removeAttribute')
            .submit(
                request.email,
                request.targetAttr,
                request.value
            )

            return true
            
        } catch(error) {
            console.log(error)

            return false
        }
    },
    
    readAttribute : async(request) => {
        try {
            const result = await request.contract.createTransaction('readAttribute')
            .evaluate(
                request.email,
                request.targetAttr
            )

            if (result.length == 0) {
                return { 
                    result : true 
                }  
            }

            return {
                result : true,
                value : JSON.parse(result)
            }   

        } catch(error) {
            console.log(error)

            return {
                result : false,
                error : error
            }
        }
    }
}

module.exports = userTx