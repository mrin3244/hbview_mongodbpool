const jwt = require('jsonwebtoken');
var sess = "";

const checkAuth = (req, res, next) => {
    sess = req.session;
    try{
        const token = sess.token;
        //const token = req.headers.authorization.split(" ")[1];
        //console.log(token);
        const decoded = jwt.verify(token, 'secret');
        req.userData = decoded;
        next();
    } catch(error) {
        res.render('error', {message:"Auth failed"});
        // return res.status(401).json({
        //     "message":"Auth failed"
        // });
    }
};

module.exports = checkAuth;