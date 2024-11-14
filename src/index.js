const app = require('./app');
require('dotenv').config()
const logger = require('./configs/logger.config');


const port = process.env.PORT || 5000;

app.listen(port, () => {
    logger.info(`Server running at ${port}`);
});
