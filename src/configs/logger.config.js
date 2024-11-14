const winston = require('winston');

// Define log format
const logFormat = winston.format.combine(
    winston.format.colorize(),  // Adds colors to the logs
    winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }), // Timestamp format
    winston.format.printf(
        ({ timestamp, level, message }) => `${timestamp} [${level}]: ${message}`
    )
);

// Create the logger instance
const logger = winston.createLogger({
    level: 'info', // Default logging level
    format: logFormat,
    transports: [
        // Console log transport
        new winston.transports.Console({
            format: logFormat,
        }),

        // File log transport (optional)
        new winston.transports.File({
            filename: 'logs/app.log',
            level: 'warn',  // Only log warnings and errors to the file
            format: winston.format.combine(
                winston.format.timestamp(),
                winston.format.json()
            ),
        }),
    ],
});

module.exports = logger;
