var Trust = require('../models/Trust')
var router = require('express').Router()
var multer = require('multer')
var upload = multer({dest: './upload/'})
var fs = require("fs")
const { Buffer } = require('buffer')

// 계약신탁출력
router.route('/trust')
    .get((req, res, next)=>{

        const trustData = req.body

        Trust.findOne((trustData),(err, result)=>{
            if(err){
                console.log(err)
                res.status(500).send("Not find trust")
            } else {
                res.sendStatus(200)
                console.log(result)
            }
        })
    })

// 계약신탁요청
router.route('/trustsub')
    .post(upload.single('Attachments'), (req, res, next)=>{
        const trustStringData = req.body

        const myFile = req.file

        console.log(trustStringData)

        const originalName = myFile.originalname
        const saveFileName = myFile.filename
        const fileSize = myFile.size

        const savePath = __dirname + "./../upload/" + saveFileName

        fs.open(savePath, "r",(err, fd)=>{
            const buffer = new Buffer.alloc(fileSize)
            fs.read(fd, buffer, 0, buffer.length, null, (err, bytes, buffer)=>{
                
                const trustData = {...trustStringData, "Attachments.originalName":originalName, "Attachments.saveFileName":saveFileName, "Attachments.fileSize":fileSize, "Attachments.fileBinary":buffer}
                
                console.log(trustData)
                
                const trust = new Trust(trustData)
                
                trust.save((err)=>{
                    if(err){
                        console.log(err)
                        res.status(500).send("Internal error please try again")
                    } else {
                        fs.unlink(savePath, function() {})
                        res.status(200).send("Send you Trust")
                    }
                })
            })
        })
    })

// 계약신탁방법, 빈라우터
router.route('/trustsub')
    .post((req, res, next)=>{
        console.log('testststst')
    })


function arrayBufferToBufferCycle(ab) {
    var buffer = new Buffer.alloc(ab.byteLength);
    var view = new Uint8Array(ab);
    for (var i = 0; i < buffer.length; ++i) {
        buffer[i] = view[i];
    }
    return buffer;
    }
// 계약신탁 첨부 파일 다운
router.route('/trustfile')
    .get((req, res, next)=>{
        // const _id = req.body._id
        const _id = req.query._id

        Trust.findOne({_id}, {_id: 0, Attachments: 1, fileBinary: 1 }, (err, result)=>{
            if(err){
                console.log(err)
                res.status(500).send("Not find trust")
            } else {
                // res.sendStatus(200)
                const fileBuffer = result.Attachments.fileBinary.buffer
                res.contentType('image/jpeg');
                const filename = "sample.png"
                res.setHeader('Content-Disposition', `attachment; filename="${filename}"`)
                res.end(arrayBufferToBufferCycle(fileBuffer));
            }
        })
})


           
module.exports = router;