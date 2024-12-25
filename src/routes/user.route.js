const express = require('express')
const { searchUsers } = require('../controllers/user.controller')
const router = express.Router()
const trimRequest = require('trim-request')
const { authMiddlewareFunction } = require('../middlewares/auth.middleware')


// trim request for post data without too many spaces
router.route("/").get(trimRequest.all, authMiddlewareFunction, searchUsers)

module.exports = router