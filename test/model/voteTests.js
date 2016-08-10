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
const Vote = require('../../model/vote');
require('./testHarness');

describe('CRUD testing', () => {
  // let id = '';
  before(function(done) {
    // debugger;
    this.newVote = new Vote({
      phoneNumber: '2063163233',
      vote: '1',
    });
    // id = this.newVote._id;
    done();
  });

  after((done) => {
    Vote.remove({});
    done();
  });

  it('should get existing votes', (done) => {
    request(server)
      .get('api/vote')
      .end((err, res) => {
        expect(err).to.eql(null);
        expect(res).to.have.status(200);
        expect(res.body[0].phoneNumber).to.eql(this.newVote.phoneNumber);
        done();
      });
  });
});
