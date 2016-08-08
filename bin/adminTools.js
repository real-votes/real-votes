#!/usr/bin/env node
'use strict';

const program = require('inquirer');
const request = require('request');
const vorpal = require('vorpal');

const addPollBaseUrl = 'https://real-votes.herokuapp.com/api/poll';
const addPollBaseUrlTest = 'http://localhost:3141/api/poll';

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
    ], (answers) => {
      const options = {
        url: addPollBaseUrlTest,
        json: { pollName: answers.pollName },
        auth: {
          username: 'admin',
          password: process.env.PASSWORD,
        },
      };

      request.post(options, (err) => {
        if (err) return console.log(err);
        this.log('Success!');
        callback();
      });
    });
  });

cli
  .command('updatePollStatus', 'Updates the status of a poll')
  .action(function(args, callback) {
    callback();
  });

cli
  .delimiter('real-votes$ ')
  .show();
