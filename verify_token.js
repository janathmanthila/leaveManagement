module.exports = function verifyToken(req, res, next) {
    //  get auth header value
    const bearerHeader = req.headers['authorization'];
    //  check if bearer is undefined
    if(typeof bearerHeader !== 'undefined'){
        //split at the space
        const bearer = bearerHeader.split(' ');
        //  get token from array
        const beaerToken = bearer[1];
        //  set the token
        req.token = beaerToken;
        //  next middleware
        next();
    }else {
        //  Forbidden
        res.sendStatus(403)
    }
}