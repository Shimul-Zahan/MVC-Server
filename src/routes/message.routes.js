const express = require('express')
const router = express.Router()
const trimRequest = require('trim-request')
const { authMiddlewareFunction } = require('../middlewares/auth.middleware')
const { getMessage, sendMessage } = require('../controllers/message.controller')


router.route('/').post(trimRequest.all, authMiddlewareFunction, sendMessage)
// get specific chats array
router.route('/:convo_id').get(trimRequest.all, authMiddlewareFunction, getMessage)


module.exports = router