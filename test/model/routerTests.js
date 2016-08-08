'use strict';

const mongoose = require('mongoose');
const chai = require('chai');
const chaiHttp = require('chai-http');

chai.use(chaiHttp);

const expect = chai.expect;
const request = chai.request;
process.env.MONGODB_URI = 'mongodb://localhost/votes-real-test';
process.env.PASSWORD = 'testpass';
const server = require('../../lib/server');
const Poll = require('../../model/poll');
const testHarness = require('./testHarness');

describe('CRUD testing', () => {
  before(function(done) {
    this.newPoll = new Poll({ pollName: 'test poll' });
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
      // expect(res.body.choices).to.eql();
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
  //
  // it('should return an error with a bad post', () => {
  //   request(port)
  //   .post('/api/')
  //   .send({
  //     fakeName: 'fake'
  //   })
  //   .end((err, res) => {
  //     expect(res).to.have.status(400);
  //     expect(res.body).to.eql('bad request')
  //
  //   });
  // });
  //
  //
});
