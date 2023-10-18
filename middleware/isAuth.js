const jwt = require('jsonwebtoken')

exports.authenticateToken = (req,res, next) => {
    console.log("I am here")
    const token = req.cookies.token;
    console.log(token)
    if(token == null){
        req.user == null;
        next()
    }else{
        const decodedToken = jwt.verify(token, process.env.SECRET_JWT)
        console.log(decodedToken)
        if(decodedToken){
            req.user = decodedToken._id;
            console.log(req.user)
        }else{
            req.user = null
        }
        next()
    }
}