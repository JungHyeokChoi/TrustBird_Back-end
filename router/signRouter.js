var User = require('../models/User')
var router = require('express').Router()
var express = require('express');


router.route('/api/signup')
    .post((req, res, next)=>{

        const userData = req.body

        const user = new User(userData)

        user.save((err)=>{
            if(err){
                console.log(err)
                res.status(500).send("Error sigup new user please try again")
            } else {
                res.status(200).send("Sign Up is Success")
            }
        })
    })

router.route('/signin')
    .post((req, res, next)=>{

        const { username, password } = req.body

        User.findOne({username}, (err, result) =>{
            if(err) {
                console.log(err)
                res.status(500).json({error : 'Internal error please try again'})
            } else if(!result) {
                console.log(result)
                res.status(401).json({error : 'This user not exist. please using after sign up'})
            } else {
                result.isCorrectPassword(password, (err, same)=>{
                    if(err){
                        console.log(err)
                        res.status(500).json({error : 'Internal error please try again'})
                    } else if (!same) {
                        res.status(401).json({error : 'Incorrect passowrd'})
                    } else {
                        res.status(200).send("HI")
                        console.log(result)
                    }
                })
            }
        })
    })

router.route('/api/signout')
    .get((req, res, next)=>{
        req.logout()
        res.redirect("/")
    })

// 회원정보수정
router.route('/api/signmodified/:email')
    .put((req, res, next)=>{

        User.update({email:req.params.email}, {$set: req.body},(err, output)=>{
            if(err) res.status(500).json({error: 'Database Update fail'})
            console.log(output)
            if(!output.n) return res.status(200).json({error: 'Not Founnd'})
            res.json({Ok: 'Database Update'})
        })

    })

// 회원탈퇴, 빈라우터
router.route('/api/trustsub')
    .get((req, res, next)=>{

    })

module.exports = router;