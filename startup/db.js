const winston = require('winston');
const mongoose = require('mongoose');
const config = require('config');


// Connects to mongo db
module.exports = function() {
  const db = config.get('db');
  mongoose.connect(db)
    .then(() => winston.info(`Connected to ${db}...`))
    .catch(err => winston.log('error', 'hello', { message: 'world' }));
}