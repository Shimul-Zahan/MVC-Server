const express = require('express')
const router = express.Router()
const AuthRoute = require('./auth.route')

router.use('/auth', AuthRoute)

module.exports = router