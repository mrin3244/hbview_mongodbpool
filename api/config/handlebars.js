const handlebars = require('express-handlebars');

const path = __dirname + '/../../views/';

const hb = handlebars({
    defaultLayout : "main" ,
    extname : "hbs" ,
    layoutsDir : path + "layouts",
    partialsDir : path + "partial"
});

module.exports = hb;