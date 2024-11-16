const express = require('express')
const app = express()
const fileupload = require('express-fileupload')
const morgan = require('morgan')
const helmet = require('helmet')
const cookieParser = require('cookie-parser')
const compression = require('compression')
const filrUpload = require('express-fileupload')
const cors = require('cors')
const httpErrors = require('http-errors')
const { error } = require('winston')
const createHttpError = require('http-errors')
require('dotenv').config()
const routes = require('./routes/index')

app.use(morgan())
app.use(helmet())
app.use(cookieParser())
app.use(compression())
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(fileupload({
    useTempFiles: true
}))
app.use(cors({
    origin: '*',
}))


// api v1 routes
app.use("/api/v1", routes)

app.use(async (req, res, next) => {
    next(createHttpError.NotFound("This route not found"))
})

// error handling
app.use(async (err, req, res, next) => {
    res.status(err.status || 500);
    res.send({
        error: {
            status: err.status || 500,
            message: err.message
        }
    })
})

module.exports = app
// export default app