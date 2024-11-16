const express = require('express')
const router = express.Router()
const trimRequest = require('trim-request')
const { authMiddlewareFunction } = require('../middlewares/auth.middleware')
const create_open_conversation = require('../controllers/conversation.controller')

router.route('/').post(trimRequest.all, authMiddlewareFunction, create_open_conversation)


module.exports = router