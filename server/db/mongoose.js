var mongoose = require('mongoose');
var MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/TodoApp'
mongoose.Promise = global.Promise;
mongoose.connect(MONGO_URI);
module.exports = {mongoose}
