const winston = require('winston');
const express = require('express');
const app = express();

require('./startup/logging')();
require('./startup/routes')(app);
require('./startup/database')();
require('./startup/config')();
require('./startup/validation')();

//process.on('uncaughtException', (ex) => {
//    winston.error(ex.message, ex);
//    process.exit(1);
//});
const port = process.env.PORT || 3000;
const server = app.listen(port, () => winston.info(`Listening on port ${port}...`));
module.exports = server;



