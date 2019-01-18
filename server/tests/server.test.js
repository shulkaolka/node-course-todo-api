const expect = require('expect');
const request = require('supertest');
const {ObjectID} = require('mongodb');

const {app} = require('./../server');
const {Todo} = require('./../models/todo');
const {User} = require('./../models/user');
const {todos, populateTodos, users, populateUsers} = require('./seed/seed');


beforeEach(populateUsers);
beforeEach(populateTodos);

describe('POST /todos', () => {
  it('should create a new todo', (done) => {
    var text = 'Test todo test';

    request(app)
    .post('/todos')
    .send({text})
    .expect(200)
    .expect((res) => {
      expect(res.body.text).toBe(text);
    })
    .end((err, res) => {
      if (err){
        return done(err);
      }

      Todo.find({text}).then((todos) => {
        expect(todos.length).toBe(1);
        expect(todos[0].text).toBe(text);
        done();
      }).catch((e) => done(e));
    });
  });

  it('should not create a new todo with invalid body data', (done) => {
    request(app)
    .post('/todos')
    .send({})
    .expect(400)
    .end(
      (err, res) => {
        if (err){
          return done(err);
        }

        Todo.find().then((todos) => {
          expect(todos.length).toBe(2);
          done();
        }).catch((e) => done(e));
      });
  });
});

describe('GET /todos', () => {
  it('should get all todos', (done) => {
    request(app)
    .get('/todos')
    .expect(200)
    .expect((res) => {
      expect(res.body.todos.length).toBe(2)})
      .end(done);
    });
});

describe('GET /todos/:id', () => {
  it('should get todo by id', (done) => {
    request(app)
    .get(`/todos/${todos[0]._id.toHexString()}`)
    .expect(200)
    .expect((res) => {
      expect(res.body.todo.text).toBe(todos[0].text)})
      .end(done);
    });

    it('should return 404 if todo not found', (done) => {
      var invalidId = new ObjectID().toHexString();
      request(app)
      .get(`/todos/${invalidId}`)
      .expect(404)
      .end(done);
      });

      it('should return 404 for non-object ids', (done) => {
        request(app)
        .get('/todos/123')
        .expect(404)
        .end(done);
        });
});

describe('PATCH /todos/:id', () => {
  it('should update todo by id', (done) => {
    var hexId = todos[0]._id.toHexString();
    var body = {
      text: 'Updated first test todo',
      completed: true,
    }

    request(app)
    .patch(`/todos/${hexId}`)
    .send(body)
    .expect(200)
    .expect((res) => {
      expect(res.body.todo._id).toBe(hexId);
      expect(res.body.todo.text).toBe(body.text);
      expect(res.body.todo.completed).toBe(body.completed);
      expect(res.body.todo.completedAt).toBeA('number');
    })
      .end(done);
    });

    it('should clear comletedAt when todo is completed', (done) => {
      var hexId = todos[1]._id.toHexString();
      var body = {
        text: 'Updated second test todo',
        completed: false,
      }

      request(app)
      .patch(`/todos/${hexId}`)
      .send(body)
      .expect(200)
      .expect((res) => {
        expect(res.body.todo._id).toBe(hexId);
        expect(res.body.todo.text).toBe(body.text);
        expect(res.body.todo.completed).toBe(body.completed);
        expect(res.body.todo.completedAt).toNotExist();
      })
        .end(done);
      });
});

describe('DELETE /todos/:id', () => {
  it('should remove todo by id', (done) => {
    var hexId = todos[1]._id.toHexString();

    request(app)
    .delete(`/todos/${hexId}`)
    .expect(200)
    .expect((res) => {
      expect(res.body.todo._id).toBe(hexId);
    })
      .end((err, res) => {
        if (err){
          return done(err);
        }

        Todo.findById(hexId).then((todo) => {
          expect(todo).toNotExist();
          done();
        }).catch((e) => done(e));
      });
    });

    it('should return 404 if todo not found', (done) => {
      var invalidId = new ObjectID().toHexString();
      request(app)
      .delete(`/todos/${invalidId}`)
      .expect(404)
      .end(done);
      });

      it('should return 404 for non-object ids', (done) => {
        request(app)
        .delete('/todos/123')
        .expect(404)
        .end(done);
        });
});

describe('GET /users/me', () => {
  it('should return user if authenticated', (done) => {
    request(app)
    .get('/users/me')
    .set('x-auth', users[0].tokens[0].token)
    .expect(200)
    .expect((res) => {
      expect(res.body._id).toBe(users[0]._id.toHexString());
      expect(res.body.email).toBe(users[0].email);
    })
    .end(done);
  });

  it('should return 401 if not authenticated', (done) => {
    request(app)
    .get('/users/me')
    .set('x-auth', '')
    .expect(401)
    .expect((res) => {
      expect(res.body).toEqual({});
    })
    .end(done);
  });
});

describe('POST /users', () => {
  it('should create a user', (done) => {
    var email = 'example@ex.com';
    var password = 'qwe123';

    request(app)
    .post('/users')
    .send({email, password})
    .expect(200)
    .expect((res) => {
      expect(res.headers['x-auth']).toExist();
      expect(res.body._id).toExist();
      expect(res.body.email).toBe(email);
    })
    .end((err) => {
      if (err){
        return done(err);
      }
      User.findOne({email}).then((user) => {
        expect(user).toExist();
        expect(user.password).toNotBe(password);
        done();
      })
    });
  });

  it('should return validation error if request invalid', (done) => {
    var email = 'example';
    var password = 'qwe123';

    request(app)
    .post('/users')
    .send({email, password})
    .expect(400)
    .end(done);
  });

  it('should not create user if email in use', (done) => {
    var email = users[0].email;
    var password = 'qwe123';

    request(app)
    .post('/users')
    .send({email, password})
    .expect(400)
    .end(done);
  });
});
