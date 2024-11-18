const express = require('express')
const router = express.Router()
const AuthRoute = require('./auth.route')
const ConversationRoute = require('./conversation.route')
const MessageRoute = require('./message.routes')

router.use('/auth', AuthRoute)
router.use('/conversation', ConversationRoute)
router.use('/message', MessageRoute)

module.exports = router