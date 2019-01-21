const express = require('express');
const checkAuth = require('../middleware/auth');
const mongodb = require('mongodb');
const joi = require('joi');
var sess = "";

module.exports = function(dbs){
    const router = express.Router();
    router.get('/', checkAuth, (req, res, next) => {
        //res.status(200).json({"message": "welcome login"})
        dbs.collection('teacher').find().toArray(function(err, docs){
            if(docs){
                //console.log(docs);
                sess = req.session;
                res.render('home', {token:sess.token, teachers:docs});
                //res.render('home',{teachers:docs});
                //return res.status(200).json(docs);
            }
            if(err){
                return res.status(500).json({"error":err});
            }
        
        });
    });
    router.get('/:tId', checkAuth, (req, res, next) => {
        const tId = mongodb.ObjectID(req.params.tId);
        //console.log(eId);
        dbs.collection('teacher').findOne({"_id":tId}, function(err, doc){
            if(doc){
                //console.log(doc);
                sess = req.session;
                res.render('edit',{token:sess.token, teacher:doc});
            }
            if(err){
                return res.status(500).json({"error":err});
            }
        });
    });

    router.post('/edit', checkAuth, (req, res, next) => {
        const tId = mongodb.ObjectID(req.body.tId);
        //console.log("id: "+tId);
        const dataset = {
            name: req.body.name,
            empNo: req.body.empNo,
            post: req.body.post,
            email: req.body.email,
            salary: req.body.salary
        };
        const schema = joi.object().keys({
            name: joi.string().required(),
            empNo: joi.number().required(),
            post: joi.string().required(),
            email: joi.string().email().required(),
            salary: joi.number().required(),
        });
        joi.validate(dataset, schema, (err, result) => {
            if(err){
                return res.status(500).json({"error": err});
            }
            if(result){
                //console.log(result);
                dbs.collection('teacher').findOneAndUpdate({"_id":tId}, {$set: result}, function(err,result){
                    
                    if(result){
                        res.redirect('/home');
                        //return res.status(200).json({"message":"update account "+eId});
                    } 
                    if(err){
                        return res.status(500).json({"error":err});
                    }
                });
            }
        });
    });

    router.get('/delete/:eId', (req, res, next) => {
        const eId = mongodb.ObjectID(req.params.eId);
        //console.log(eId);
        dbs.collection('teacher').deleteOne({"_id":eId}, function(err, result){
            if(result){
                res.redirect('/home');
                //res.status(200).json(result);
            }
            if(err){
                return res.status(500).json({"error":err});
            }
        });
        
    });

    return router;
};