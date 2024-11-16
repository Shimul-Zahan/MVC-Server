const createHttpError = require("http-errors");
const jwt = require("jsonwebtoken");

const authMiddlewareFunction = async (req, res, next) => {
    if (!req.headers['authorization']) {
        return next(createHttpError.Unauthorized());
    }

    const bearerToken = req.headers["authorization"]
    const token = bearerToken.split(' ')[1]
    // res.send(token)
    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, payload) => {
        if (err) {
            return next(createHttpError.Unauthorized())
        }
        req.user = payload
        next()
    })
}

module.exports = { authMiddlewareFunction }