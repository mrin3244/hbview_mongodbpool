const express = require('express');
const app = express();
var session = require('express-session');
app.use(session({ secret: 'secret-key', resave: true, saveUninitialized: true }));
var sess = "";

module.exports = function(dbs, hb){

    app.engine("hbs", hb);
    app.set("view engine","hbs");

    const bodyparser = require('body-parser');

    const loginRoutes = require('./api/routes/login')(dbs);
    const homeRoutes = require('./api/routes/home')(dbs);

    app.use(express.static(__dirname + '/views/public'));
    
    
    // get input from body
    app.use(bodyparser.urlencoded({extended:false}));
    app.use(bodyparser.json());
    
    // Routes which should handel request
    app.use('/login', loginRoutes);
    app.use('/home', homeRoutes);
    //Home route
    app.get('/', (req, res) => {
        sess = req.session;
        res.render('index', {token:sess.token});
    });
    app.get('/log_view', (req, res) => {
        sess = req.session;
        if(!sess.token){
            res.render('login', {token:sess.token});
        } else{
            res.redirect('/');
        }
        
    });
    app.get('/reg_view', (req, res) => {
        sess = req.session;
        if(!sess.token){
            res.render('registration', {token:sess.token});
        } else{
            res.redirect('/');
        }
    });

    app.get('/logout', (req, res, next) => {
        req.session.destroy();
        res.redirect('/');
    });

    app.get('/*', (req, res) => {
        res.render('error');
    });

    return app;
}