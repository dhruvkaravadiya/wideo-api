const jwt = require('jsonwebtoken');

function verifyToken(req,res,next){
    const token = req.cookies.access_token;
    if(!token){
        return res.status(401).send('You are not Authenticated');
    }
    jwt.verify(token , process.env.JWT_KEY , (err,user)=>{
        if(err){
            return res.status(403).send('Invalid Token');
        }
        req.user = user;
        next();
    });
}
module.exports = verifyToken;