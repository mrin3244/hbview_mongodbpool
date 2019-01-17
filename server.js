// const http = require("http");

// const app = require("./app");

// const port = process.env.PORT || 3240;

// const server = http.createServer(app);

// server.listen(port);

const port = process.env.PORT || 3240;

const connectDB = require('./api/config/database');

connectDB(function(err, client){
    if(err) throw err;
    if(!err){
        var dbs = client.db('mydb');
        const app = require('./app')(dbs); // pass db instance to app
        app.listen(port);

        //const server = http.createServer(app);
        //server.listen(port);
    }

});