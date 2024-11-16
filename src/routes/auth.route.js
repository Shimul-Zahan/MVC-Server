const express = require('express')
const { register, refreshToken, logout, login } = require('../controllers/auth.controller')
const router = express.Router()
const trimRequest = require('trim-request')
const { authMiddlewareFunction } = require('../middlewares/auth.middleware')


// trim request for post data without too many spaces
router.route("/registration").post(trimRequest.all, register)
router.route("/login").post(trimRequest.all, login)
router.route("/logout").post(trimRequest.all, logout)
router.route("/refreshtoken").post(trimRequest.all, refreshToken)
router.route("/testingauthMiddleware").get(trimRequest.all, authMiddlewareFunction, (req, res) => {
    res.send(req.user)
})

module.exports = router