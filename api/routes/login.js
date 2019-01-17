const express = require('express');
const joi = require('joi');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

module.exports = function(dbs){
    const router = express.Router();
    router.post('/', (req, res, next) => {
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
                    return res.status(200).json({
                        "message":"Auth successful",
                        "token": token
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
                bcrypt.hash(req.body.password, 10, (err,hash) => {
                    if(err){
                        return res.status(500).json({
                            "error": err
                        })
                    } else {
                        const dataset = {
                            name: req.body.name,
                            empNo: req.body.empNo,
                            post: req.body.post,
                            email: req.body.email,
                            password: hash,
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
                                dbs.collection('teacher').insertOne(dataset, function(err, result) {
                                    if(result){
                                        return res.status(200).json({"message": "insert data"});
                                    }
                                    if(err){
                                        return res.status(500).json({"error":err});
                                    }
                                });
                            }

                        });
                        
                    }
                });
            }

        });

    });

    return router;
};