#!/usr/bin/env node
'use strict';

const request = require('request');
const vorpal = require('vorpal');
const prettyjson = require('prettyjson');
const Pie = require('cli-pie');

// const PollBaseUrl = 'https://real-votes.herokuapp.com/api/poll';
const PollBaseUrlTest = 'http://localhost:3141/api/poll/';
const VoteBaseUrlTest = 'http://localhost:3141/api/vote/';

console.log('Hello welcome to the real-votes admin console.');

const cli = vorpal();

cli
  .command('addPoll', 'Creates a new poll')
  .action(function(args, callback) {
    this.prompt([
      {
        type: 'input',
        name: 'pollName',
        message: 'What would you like to name your poll? ',
      },
      {
        type: 'input',
        name: 'choices',
        message: 'Please enter your choices for this poll: ',
      },
      {
        type: 'input',
        name: 'votesPerUser',
        message: 'Please enter your max votes for this poll: ',
      },
    ], (answers) => {
      const options = {
        url: PollBaseUrlTest,
        json: {
          pollName: answers.pollName,
          choices: [answers.choices],
          votesPerUser: answers.votesPerUser,
        },
        auth: {
          username: 'admin',
          password: process.env.PASSWORD,
        },
      };

      request.post(options, (err) => {
        if (err) return this.log(err);
        this.log('Success!');
        callback();
      });
    });
  });

cli
  .command('updatePollStatus', 'Updates the status of a poll')
  .action(function(args, callback) {
  });

cli
  .command('viewAllPolls', 'Shows all polls')
  .action(function(args, callback) {
    request.get(PollBaseUrlTest, (err, res, body) => {
      if (err) return this.log(err);
      // const testObj = {test:'test data'};
      this.log(prettyjson.render(JSON.parse(body)));
      callback();
    });
  });

cli
  .command('showResults', 'Show the results of the current poll')
  .action(function(args, callback) {
    request.get(`${VoteBaseUrlTest}tally`, (err, res, body) => {
      if (err) return this.log(err);
      const results = JSON.parse(body);
      const chart = new Pie(10, [], { legend: true });

      Object.keys(results).forEach((key) => {
        chart.add({
          label: key,
          value: results[key],
        });
      });

      this.log(chart.toString());
      callback();
    });
  });

cli
  .delimiter('real-votes-admin$ ')
  .show();
