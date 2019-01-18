const handlebars = require('express-handlebars');

const path = __dirname + '/../../views';

const hb = handlebars({
    defaultLayout : "layout" ,
    extname : "hbs" ,
    layoutsDir : path,
    partialsDir : path
});

module.exports = hb;