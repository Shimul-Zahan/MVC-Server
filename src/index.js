const app = require('./app');
const { Server } = require("socket.io")
const logger = require('./configs/logger.config');
const mongoose = require('mongoose')
const SocketServer = require("./SocketServer")
require('dotenv').config()


const port = process.env.PORT || 5000;

// env variables
const { mongoURL } = process.env;

// exit on mongodb error
mongoose.connection.on('error', (err) => {
    logger.error(`Mongodb connection error: ${err}`)
    process.exit(1)
})

// mongoconnect
mongoose.connect(mongoURL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
}).then(() => {
    logger.info('Connected to Mongodb')
})

// mongodb debug
// if (process.env.bla !== 'production') {
//     mongoose.set("debug", true)
// }

const server = app.listen(port, () => {
    // console.log(mongoURL);
    logger.info(`Server running at ${port}...`);
});


// Initialize Socket.IO with the server
const io = new Server(server, {
    cors: {
        origin: "*",
        methods: ["GET", "POST"]
    }
});

io.on("connection", (socket) => {
    logger.info("Socket io connected successfully", socket)
    SocketServer(socket, io)
})