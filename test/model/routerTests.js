'use strict';

const chai = require('chai');
const chaiHttp = require('chai-http');

chai.use(chaiHttp);

const expect = chai.expect;
const request = chai.request;
process.env.MONGODB_URI = 'mongodb://localhost/votes-real-test';
process.env.PASSWORD = 'testpass';
const server = require('../../lib/server');
const Poll = require('../../model/poll');
require('./testHarness');

describe('CRUD testing', () => {
  let id = '';
  before(function(done) {
    this.newPoll = new Poll({ pollName: 'test poll' });
    id = this.newPoll._id;
    console.log(this.newPoll);
    done();
  });

  after((done) => {
    Poll.remove({});
    done();
  });

  it('should post a poll with a name and choices', (done) => {
    request(server)
    .post('/api/poll')
    .auth('admin', 'testpass')
    .send({
      pollName: 'test poll',
      choices: [
        'choice 1',
        'choice 2',
        'choice 3',
      ],
    })
    .end((err, res) => {
      expect(err).to.eql(null);
      expect(res).to.have.status(200);
      expect(res.body.pollName).to.eql('test poll');
      expect(res.body.choices).to.eql(['choice 1', 'choice 2', 'choice 3']);
      done();
    });
  });

  it('should not post with a bad username and password', (done) => {
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

  it('should get a poll', function(done) {
    request(server)
    .get('/api/poll')
    .end((err, res) => {
      expect(err).to.eql(null);
      expect(res).to.have.status(200);
      expect(res.body[0].pollName).to.eql(this.newPoll.pollName);
      done();
    });
  });


  it('should put/update the poll status', function(done) {
    request(server)
      .put(`/api/poll/${id}`)
      .auth('admin', 'testpass')
      .send({ pollStatus: 'in_progress' })
      .end((err, res) => {
        console.log(this.newPoll.pollStatus);
        console.log(res.body);
        expect(err).to.eql(null);
        expect(res).to.have.status(200);
        expect(this.newPoll.pollStatus).to.eql('in_progress');
        done();
      });
  });

  it('should delete all polls', (done) => {
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

  it('should delete a poll with specific id', (done) => {
    request(server)
      .delete(`/api/poll/${id}`)
      .auth('admin', 'testpass')
      .end((err, res) => {
        expect(err).to.eql(null);
        expect(res).to.have.status(200);
        expect(res.body).to.eql({});
        done();
      });
  });
});
