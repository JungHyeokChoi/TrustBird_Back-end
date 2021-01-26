const crypto = require('crypto')
const multer = require('multer')

const jsonToHash = (data) => {
    var hashData = "0x" + crypto.createHash('sha256').update(JSON.stringify(data)).digest('hex')

    return hashData
}

const storage = multer.diskStorage({
    destination : "./pubilc/img",
    filename : function(req, file, cb) {
        cb(null, `${Date.now()}`)
    }
})

const upload = multer({ storage, limits : { files : 10 }})

module.exports = {
    jsonToHash,
    upload
};