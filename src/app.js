const expres = require('express')
const app = expres()
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

app.use(morgan())
app.use(helmet())
app.use(cookieParser())
app.use(compression())
app.use(expres.json())
app.use(expres.urlencoded({ extended: true }))
app.use(fileupload({
    useTempFiles: true
}))
app.use(cors({
    origin: '*',
}))

app.get('/', (req, res) => {
    // throw createHttpError.BadRequest("this is bad request error")
    res.send({ message: 'Hello World' })
})

app.use( async (req, res, next) => {
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