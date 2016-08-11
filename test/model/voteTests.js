'use strict';

const chai = require('chai');
const chaiHttp = require('chai-http');

chai.use(chaiHttp);

const expect = chai.expect;
const request = chai.request;
process.env.MONGODB_URI = 'mongodb://localhost/vote-real-test';
process.env.PASSWORD = 'testpass';
const server = require('../../lib/server');
const User = require('../../model/user');

const harness = require('./testHarness');

describe('CRUD testing', () => {
  before(function(done) {
    this.newUser = new User({
      phoneNumber: '2063163233',
      vote: '1',
    });
    done();
  });

  after((done) => {
    User.remove({});
    done();
  });

  // it('should sms callback', function(done) { //eslint-disable-line
  //   request(server)
  //     .get('/api/vote/sms_callback')
  //     .end((err, res) => {
  //       expect(err).to.eql(null);
  //       expect(res).to.have.status(200);
  //       expect(res.body).to.eql({});
  //       done();
  //     });
  // });

  // it('should get vote tally', function(done) {
  //   request(server)
  //     .get('/api/vote/tally')
  //     .end((err, res) => {
  //       expect(err).to.eql(null);
  //       expect(res).to.have.status(200);
  //       expect(res.body).to.eql();
  //       done();
  //     });
  // });

  it('should get all votes', function(done) { //eslint-disable-line
    request(server)
    .get('/api/vote')
    .auth('admin', 'testpass')
    .end((err, res) => {
      expect(err).to.eql(null);
      expect(res).to.have.status(200);
      expect(res.body).to.eql([]);
      done();
    });
  });

  it('should delete all votes', function(done) { //eslint-disable-line
    request(server)
      .delete('/api/vote')
      .auth('admin', 'testpass')
      .end((err, res) => {
        expect(err).to.eql(null);
        expect(res).to.have.status(200);
        expect(res.body).to.eql({ message: 'All Votes deleted' }) //eslint-disable-line
        done();
      });
  });

  // it('should get existing votes', (done) => {
  //   request(server)
  //     .get('api/vote')
  //     .end((err, res) => {
  //       expect(err).to.eql(null);
  //       expect(res).to.have.status(200);
  //       expect(res.body[0].phoneNumber).to.eql(this.newUser.phoneNumber);
  //       done();
  //     });
  // });
});
