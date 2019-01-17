var mongoose = require('mongoose');
var MONGO_URI = process.env.MONGO_URI || 'mongodb://herokuuser:qweASD123@ds159624.mlab.com:59624/todosapps'
mongoose.Promise = global.Promise;
mongoose.connect(MONGO_URI);

module.exports = {mongoose}
