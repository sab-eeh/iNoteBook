const jwt = require("jsonwebtoken");
const JWT_secret = "hello sabeeh";


const fetchuser = (req, res, next) =>{
    const token  = req.header('auth-token')
    if(!token){
        res.staus(401).send({error : "PLease authenticate using a valid token"})
    }
    try{
        const data = jwt.verify(token, JWT_secret )
        req.user = data.user
        next()
    }
    catch(error){
        res.status(401).send({error : "PLease authenticate using a valid token"})
    }

}

module.exports = fetchuser