const bcrypt = require('bcryptjs')
const crypto = require('crypto')
const multer = require('multer')

const jsonToHash = (data) => {
    const hashData = "0x" + crypto.createHash('sha256').update(JSON.stringify(data)).digest('hex')

    return hashData
}

const objectToArray = (object, array) => {
    if(typeof(object) === "object") {
        for(let value of Object.values(object)) {
            objectToArray(value, array)
        }
    } else {
        array.push(object)
    }
}


const selectProperties = (object, projection) => {
    let isProjection = false

    for(let value of Object.values(projection)){
        isProjection = isProjection | value
    }


    if(isProjection) {
        for(let objKey of Object.keys(object)){
            let isKey = false
            
            for(let [proKey, proValue] of Object.entries(projection)){
                if(objKey === proKey) {
                    if(proValue) {
                        isKey = true
                    } else {
                        delete object[objKey]                    
                    }
                }
            }

            if(!isKey) {
                delete object[objKey]
            }
        }
    } else {
        for(let objKey of Object.keys(object)){
            for(let [proKey, proValue] of Object.entries(projection)){
                if(objKey === proKey) {
                    if(!proValue) {
                    	delete object[objKey]
                    }
                }                
            }
        }
    }
}

const passwordToHash = (password) => {
    return bcrypt.hashSync(password, 10)
}

const isCorrectPassword = (connectionPassword, password) => {
    return bcrypt.compareSync(connectionPassword, password)
}

const storage = multer.diskStorage({
    destination : "./pubilc/img",
    filename : function(req, file, cb) {
        cb(null, `${Date.now()}.jpg`)
    }
})

const upload = multer({ storage, limits : { files : 10 }})

module.exports = {
    jsonToHash,
    objectToArray,
    selectProperties,
    passwordToHash,
    isCorrectPassword,
    objectToArray,
    upload
}