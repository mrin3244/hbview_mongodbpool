const express = require('express');
const checkAuth = require('../middleware/auth');

module.exports = function(dbs){
    const router = express.Router();
    router.get('/', checkAuth, (req, res, next) => {
        //res.status(200).json({"message": "welcome login"})
        dbs.collection('teacher').find().toArray(function(err, docs){
            if(docs){
                return res.status(200).json(docs);
            }
            if(err){
                return res,status(500).json({"error":err});
            }
        
        });
    });

    return router;
};