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
const User = require('../../model/user');
require('./testHarness');

describe('CRUD testing', () => {
  // let id = '';
  before(function(done) {
    // debugger;
    this.newUser = new User({
      phoneNumber: '2063163233',
      vote: '1',
    });
    // id = this.newUser._id;
    done();
  });

  after((done) => {
    User.remove({});
    done();
  });

  it('should delete all votes', (done) => {
    request(server)
      .delete('/api/vote')
      .auth('admin', 'testpass')
      .end((err, res) => {
        expect(err).to.eql(null);
        expect(res).to.have.status(200);
        expect(res.body).to.eql({ message: 'All Votes deleted' })
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
