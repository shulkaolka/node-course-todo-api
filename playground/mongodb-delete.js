const {MongoClient, ObjectID} = require('mongodb');

MongoClient.connect('mongodb://localhost:27017/TodoApp', (err, client) => {
  if (err) {
    return console.log('Unable to connect to MongoDB Server');
  }
  console.log('Connected to MongoDB server');
  const db = client.db('TodoApp')

  // db.collection('Todos')
  // .findOneAndDelete({text: 'Eat lunch'})
  // .then((result) => {
  //   console.log(result);
  // });
  // db.collection('Users')
  // .deleteMany({name: 'Olha'})
  // .then((result) => {
  //   console.log(result);
  // });

  db.collection('Users').findOneAndDelete({_id: new ObjectID("5c3f4aedf4b7cb1b71509d47")}).then((results) => {
    console.log(JSON.stringify(results, undefined, 2));
  })

  client.close();
});
