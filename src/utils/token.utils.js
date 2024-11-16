const jwt = require('jsonwebtoken')

const sign = async (payload, expire, secret) => {
    try {
        // Use jwt.sign() to create a token with payload, expiration time, and secret key
        const token = jwt.sign(payload, secret, { expiresIn: expire });
        return token;
    } catch (error) {
        throw new Error('Error generating token: ' + error.message);
    }
}

const verify = async (token, secret) => {
    try {
        const decoded = await jwt.verify(token, secret);
        return decoded;
    } catch (error) {
        throw new Error("Invalid or expired token");
    }
}

module.exports = { sign, verify }