'use strict';

const chai = require('chai');
const chaiHttp = require('chai-http');
const mongoose = require('mongoose');

chai.use(chaiHttp);

const expect = chai.expect;
const request = chai.request;

process.env.MONGODB_URI = 'mongodb://localhost/real-votes-test';
process.env.PASSWORD = 'testpass';

const server = require('../lib/server');
const Poll = require('../model/poll');
const User = require('../model/user');

mongoose.connection.db.dropDatabase();

describe('Schema tests', () => {
  describe('Poll schema', () => {
    beforeEach(function(done) { //eslint-disable-line
      new Poll({
        pollName: 'test poll',
        choices: ['choice 1', 'choice 2', 'choice 3'],
        votesPerUser: 3,
      }).save()
      .then((poll) => {
        this.id = poll._id;
        done();
      })
      .catch((err) => console.log(err));
    });

    afterEach((done) => {
      mongoose.connection.db.dropDatabase(done);
    });

    it('Should be able to perform READ on a Poll from database', function() {
      return Poll.findOne({ _id: this.id })
      .then((poll) => {
        expect(poll.pollName).to.eql('test poll');
        expect(poll.choices.length).to.eql(3);
        expect(poll.votesPerUser).to.eql(3);
        expect(poll.pollStatus).to.eql('not_started');
      });
    });
  });

  describe('User schema', () => {
    beforeEach(function(done) { //eslint-disable-line
      new User({
        phoneNumber: '12356786574',
        vote: ['123', '456'],
      }).save()
      .then((user) => {
        this.id = user._id;
        done();
      })
      .catch((err) => console.log(err));
    });

    afterEach((done) => {
      mongoose.connection.db.dropDatabase(done);
    });

    it('Should be able to perform READ on a Poll from database', function() {
      return User.findOne({ _id: this.id })
      .then((user) => {
        expect(user.phoneNumber).to.eql('12356786574');
        expect(user.vote.length).to.eql(2);
      });
    });
  });
});

describe('Server CRUD testing', () => {
  beforeEach(function(done) { //eslint-disable-line
    new Poll({
      pollName: 'test poll',
      choices: ['1', '2', '3'],
    }).save()
    .then((poll) => {
      this.id = poll._id;
      new User({
        phoneNumber: '1234',
        vote: ['1'],
        pollId: this.id,
      }).save()
      .then(() => {
        done();
      });
    })
    .catch((err) => console.error(err));
  });

  afterEach((done) => {
    mongoose.connection.db.dropDatabase(done);
  });

  it('should post a poll with a name and choices', function(done) { //eslint-disable-line
    request(server)
    .post('/api/poll')
    .auth('admin', 'testpass')
    .send({
      pollName: 'test poll 2',
      choices: [
        'choice 1',
        'choice 2',
        'choice 3',
      ],
    })
    .end((err, res) => {
      expect(err).to.eql(null);
      expect(res).to.have.status(200);
      expect(res.body.pollName).to.eql('test poll 2');
      expect(res.body.choices).to.eql(['choice 1', 'choice 2', 'choice 3']);
      done();
    });
  });

  it('should not post with a bad username and password', function(done) { //eslint-disable-line
    request(server)
    .post('/api/poll')
    .auth('hax0r', 'imahaxu')
    .send({ pollName: 'fail poll' })
    .end((err, res) => {
      expect(res).to.have.status(401);
      expect(res.body).to.eql({});
      done();
    });
  });

  it('should get a poll', function(done) { //eslint-disable-line
    request(server)
    .get('/api/poll')
    .end((err, res) => {
      expect(err).to.eql(null);
      expect(res).to.have.status(200);
      expect(res.body[0].pollName).to.eql('test poll');
      done();
    });
  });

  it('should put/update the poll status', function(done) {
    request(server)
    .put(`/api/poll/${this.id}`)
    .auth('admin', 'testpass')
    .send({ pollStatus: 'in_progress' })
    .end((err, res) => {
      expect(err).to.eql(null);
      expect(res).to.have.status(200);
      expect(res.body.pollStatus).to.eql('in_progress');
      done();
    });
  });

  it('should delete a poll with specific id', function(done) {
    request(server)
      .delete(`/api/poll/${this.id}`)
      .auth('admin', 'testpass')
      .end((err, res) => {
        expect(err).to.eql(null);
        expect(res).to.have.status(200);
        expect(res.body).to.eql({ message: "Poll deleted." }); //eslint-disable-line
        done();
      });
  });

  it('should delete all polls', function(done) { //eslint-disable-line
    request(server)
    .delete('/api/poll')
    .auth('admin', 'testpass')
    .end((err, res) => {
      expect(err).to.eql(null);
      expect(res).to.have.status(200);
      expect(res.body).to.eql({ message: 'All Polls deleted' });
      done();
    });
  });

  it('should get all votes from a specific poll', function(done) { //eslint-disable-line
    request(server)
    .get(`/api/poll/${this.id}/users`)
    .auth('admin', 'testpass')
    .end((err, res) => {
      expect(err).to.eql(null);
      expect(res).to.have.status(200);
      expect(res.body.length).to.eql(1);
      done();
    });
  });

  it('should delete all votes from a specific poll', function(done) { //eslint-disable-line
    request(server)
    .delete(`/api/poll/${this.id}/users`)
    .auth('admin', 'testpass')
    .end((err, res) => {
      expect(err).to.eql(null);
      expect(res).to.have.status(200);
      expect(res.body.message).to.eql('deleted 1 user(s) associated with the poll.');
      done();
    });
  });
});
