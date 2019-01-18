var mongoose = require('mongoose');
var MONGO_URI = process.env.MONGO_URI
mongoose.Promise = global.Promise;
mongoose.connect(MONGO_URI);
module.exports = {mongoose}
