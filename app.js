const express = require('express');
const app = express();
var session = require('express-session');
app.use(session({ secret: 'secret-key', resave: true, saveUninitialized: true }));

module.exports = function(dbs, hb){

    app.engine("hbs", hb);
    app.set("view engine","hbs");

    const bodyparser = require('body-parser');

    const loginRoutes = require('./api/routes/login')(dbs);
    const homeRoutes = require('./api/routes/home')(dbs);
    
    
    // get input from body
    app.use(bodyparser.urlencoded({extended:false}));
    app.use(bodyparser.json());
    
    // Routes which should handel request
    app.use('/login', loginRoutes);
    app.use('/home', homeRoutes);
    //Home route
    app.get('/', (req, res) => {
        res.render('index');
    });
    app.get('/log_view', (req, res) => {
        res.render('login');
    });
    app.get('/reg_view', (req, res) => {
        res.render('registration');
    });

    return app;
}