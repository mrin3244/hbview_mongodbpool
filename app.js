const express = require('express');
const app = express();

module.exports = function(dbs){

    const bodyparser = require('body-parser');

    const loginRoutes = require('./api/routes/login')(dbs);
    const homeRoutes = require('./api/routes/home')(dbs);
    
    
    // get input from body
    app.use(bodyparser.urlencoded({extended:false}));
    app.use(bodyparser.json());
    
    // Routes which should handel request
    app.use('/login', loginRoutes);
    app.use('/home', homeRoutes);

    return app;
}