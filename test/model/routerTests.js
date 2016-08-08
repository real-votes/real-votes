'use strict';

const mongoose = require('mongoose');
const chai = require('chai');
const chaiHttp = require('chai-http');

chai.use(chaiHttp);

const expect = chai.expect;
const request = chai.request;

// const Poll = require('../../model/poll');

const port = process.env.PORT || 3141;

mongoose.connect('mongodb://localhost/votes-real-test');

describe('CRUD testing', () => {
  it('should post a poll with a name and choices', (done) => {
    request(port)
    .post('/api/poll')
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
      expect(res.body.choices).to.eql();
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
  // it('should get a vote', (done) => {
  //   request('localhost:3141')
  //   .get('/api')
  //
  //   .end((err, res) => {
  //     expect(err).to.eql(null);
  //     expect(res).to.have.status(200);
  //     //other tests?
  //     done();
  //   })
  // });
  //
  // it('should update test', (done) => {
  //
  // });
});
