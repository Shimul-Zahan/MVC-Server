const expres = require('express')
const app = expres()
const fileupload = require('express-fileupload')
const morgan = require('morgan')
const helmet = require('helmet')
const cookieParser = require('cookie-parser')
const compression = require('compression')
const filrUpload = require('express-fileupload')
const cors = require('cors')
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
    res.send({ message: 'Hello World' })
})

module.exports = app
// export default app