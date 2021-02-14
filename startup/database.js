const mongoose = require('mongoose');
const winston = require('winston');
const config = require('config');

module.exports = function() {
    //connect to the mongoose server and create a database called playground.
    const db = config.get('db');
    mongoose.connect(db)
     .then(() => winston.info(`Connected to ${db}..`));
};