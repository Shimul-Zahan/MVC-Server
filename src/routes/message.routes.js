const express = require('express')
const router = express.Router()
const router = require('.')
const trimRequest = require('trim-request')
const { authMiddlewareFunction } = require('../middlewares/auth.middleware')
const { sendMessage } = require('../controllers/')


router.route('/').post(trimRequest.all, authMiddlewareFunction, sendMessage)
// get specific chats array
router.route('/:convo_id').get(trimRequest.all, authMiddlewareFunction, getMessages)


module.exports = router