const jwt = require('jsonwebtoken')
const httpError = require('../models/errorModels')

const authMiddleware = async(req,res,next) => {
    const Authorization = req.headers.Authorization || req.headers.authorization
    if(Authorization && Authorization.startsWith('Bearer')){
        const token = Authorization.split(" ")[1]
        jwt.verify(token,process.env.JWT_SECRET,(err,info) => {
            if(err) {
                return next(new httpError("unauthorized .invalid token",422))
            }
            req.user = info
            next()
        })
    }else{
        return next(new httpError("unauthorized .invalid token",422))
    }
}
module.exports = authMiddleware