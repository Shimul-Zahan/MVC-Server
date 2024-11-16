const express = require('express')
const router = express.Router()
const AuthRoute = require('./auth.route')
const ConversationRoute = require('./conversation.route')

router.use('/auth', AuthRoute)
router.use('/conversation', ConversationRoute)

module.exports = router