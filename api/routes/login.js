const express = require('express');
const joi = require('joi');
const bcrypt = require('bcrypt-nodejs');
const jwt = require('jsonwebtoken');
var sess = "";


module.exports = function(dbs){
    const router = express.Router();
    router.post('/', (req, res, next) => {
        sess = req.session;
        //res.status(200).json({"message": "welcome login"})
        dbs.collection('teacher').find({"email":req.body.email}).toArray(function(err, docs){
            if(err){
                return res,status(500).json({"error":err});
            }
            if(docs.length < 1){
                return res.status(401).json({
                    "message":"Auth failed"
                });
            }
            bcrypt.compare(req.body.password, docs[0].password, (err, result) => {
                if(err){
                    return res.status(401).json({
                        "message":"Auth failed"
                    });  
                }
                if(result){
                    //console.log(sess);
                    const token = jwt.sign(
                        {
                            "email": docs[0].email,
                            "id": docs[0]._id
                        }, 
                        'secret', //process.env.JWT_KEY //'secret'
                        {
                            expiresIn: "1h"
                        }
                    );
                    sess.token=token;
                    //sess.email = docs[0].email;
                    //res.write('<h1>Hello '+sess.token+'</h1>');
                    //res.end('<a href="+">Login</a>');
                    return res.status(200).json({
                        "message":"Auth successful",
                        "token": sess.token
                    });
                }
            });
        
        });
    });

    router.post('/reg', (req, res, next) => {
        dbs.collection('teacher').find({"email":req.body.email}).toArray(function(err, docs){
            if(err){
                return res,status(500).json({"error":err});
            }
            if(docs.length >= 1){
                return res.status(409).json({
                    "message":"user exists"
                });
            } else {
                const dataset = {
                    name: req.body.name,
                    empNo: req.body.empNo,
                    post: req.body.post,
                    email: req.body.email,
                    password: req.body.password,
                    salary: req.body.salary
                };
                const schema = joi.object().keys({
                    name: joi.string().required(),
                    empNo: joi.number().required(),
                    post: joi.string().required(),
                    email: joi.string().email().required(),
                    password: joi.required(),
                    salary: joi.number().required(),
                });
                joi.validate(dataset, schema, (err, result) => {
                    if(err){
                        return res.status(500).json({"error": err});
                    }
                    if(result){
                        const saltRounds = 10;
                        var salt = bcrypt.genSaltSync(saltRounds);
                        var hash = bcrypt.hashSync(result.password, salt);
                        result.password = hash;
                        //console.log(result);
                        dbs.collection('teacher').insertOne(result, function(err, result) {
                            if(result){
                                return res.status(200).json({"message": "insert data"});
                            }
                            if(err){
                                return res.status(500).json({"error":err});
                            }
                        });
                    }

                });
                // bcrypt.hash(req.body.password, 10, (err,hash) => {
                //     if(err){
                //         return res.status(500).json({
                //             "error": err
                //         })
                //     } else {
                        
                        
                //     }
                // });
            }

        });

    });

    return router;
};