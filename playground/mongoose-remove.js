const {ObjectID} = require('mongodb');

const {mongoose} = require('./../server/db/mongoose');
const {Todo} = require('./../server/models/todo');
const {User} = require('./../server/models/user');

Todo.remove({}).then((result) => {
  console.log(result);
});

// Todo.findOneAndRemove({text:'test'}).then((todo) => {
//   console.log(todo);
// });
// Todo.findByIdAndRemove('5c40a22e5ded67b012a0840c').then((todo) => {
//   console.log(todo);
// });
