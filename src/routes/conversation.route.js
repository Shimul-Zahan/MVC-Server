const express = require('express')
const router = express.Router()
const trimRequest = require('trim-request')
const { authMiddlewareFunction } = require('../middlewares/auth.middleware')
const { create_open_conversation, getAllConversationForAUser, createGroup } = require('../controllers/conversation.controller')

router.route('/').post(trimRequest.all, authMiddlewareFunction, create_open_conversation)

router.route('/').get(trimRequest.all, authMiddlewareFunction, getAllConversationForAUser)

router.route('/group').post(trimRequest.all, authMiddlewareFunction, createGroup)


module.exports = router