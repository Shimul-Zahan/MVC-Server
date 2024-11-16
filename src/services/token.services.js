const { sign, verify } = require("../utils/token.utils")

const generateToken = async (payload, expire, secret) => {
    let token = await sign(payload, expire, secret)
    return token
}

const verifyToken = async (token, secret) => {
    let check = await verify(token, secret)
    return check
}

module.exports = { generateToken, verifyToken }