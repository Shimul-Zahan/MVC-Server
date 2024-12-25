const express = require('express')
const router = express.Router()
const AuthRoute = require('./auth.route')
const ConversationRoute = require('./conversation.route')
const MessageRoute = require('./message.routes')
const UserRoute = require('./user.route')

router.use('/auth', AuthRoute)
router.use('/conversation', ConversationRoute)
router.use('/message', MessageRoute)
router.use('/user', UserRoute)

module.exports = router