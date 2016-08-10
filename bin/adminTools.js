#!/usr/bin/env node
'use strict'; //eslint-disable-line

const request = require('request');
const vorpal = require('vorpal');
const prettyjson = require('prettyjson');
const Pie = require('cli-pie');
const mongoose = require('mongoose');
const randomcolor = require('randomcolor');
const EventSource = require('eventsource');
const chalk = require('chalk');


const User = require('../model/user');

const PollBaseUrlTest = 'http://localhost:3141/api/poll/';
const VoteBaseUrlTest = 'http://localhost:3141/api/vote/';

const highlight = chalk.bold.green;

const mongoServer = process.env.MONGODB_URI || 'mongodb://localhost/pollDatabase';
mongoose.connect(mongoServer);

console.log(highlight('Hello welcome to the real-votes admin console.'));

const cli = vorpal();

cli
  .command('addPoll', 'Creates a new poll')
  .action(function(args, callback) {
    this.prompt([
      {
        type: 'input',
        name: 'pollName',
        message: highlight('What would you like to name your poll? '),
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
          choices: answers.choices.split(','),
          votesPerUser: answers.votesPerUser,
        },
        auth: {
          username: 'admin',
          password: process.env.PASSWORD,
        },
      };

      request.post(options, (err) => {
        if (err) {
          this.log(err);
          return callback();
        }
        this.log('Success!');
        callback();
      });
    });
  });

cli
  .command('updatePollStatus', 'Updates the status of a poll')
  .action(function(args, callback) {
    this.prompt([
      {
        type: 'input',
        name: 'id',
        message: 'Please enter the polls id you want to update: ',
      },
      {
        type: 'input',
        name: 'pollStatus',
        message: 'Please enter the status you want to set: ',
      },
    ], (answers) => {
      const options = {
        url: PollBaseUrlTest + answers.id,
        json: { pollStatus: answers.pollStatus },
        auth: {
          username: 'admin',
          password: process.env.PASSWORD,
        },
      };

      request.put(options, (err) => {
        if (err) {
          this.log(err);
          return callback();
        }
        this.log('Success!');
        callback();
      });
    });
  });

cli
    .command('deletePoll', 'deletes one poll')
    .action(function(args, callback) {
      this.prompt([
        {
          type: 'input',
          name: 'id',
          message: 'Please enter the polls id you want to delete: ',
        },
      ], (answers) => {
        const options = {
          url: PollBaseUrlTest + answers.id,
          auth: {
            username: 'admin',
            password: process.env.PASSWORD,
          },
        };

        request.delete(options, (err) => {
          if (err) {
            this.log(err);
            return callback();
          }
          this.log('Success!');
          callback();
        });
      });
    });

cli
  .command('addTestVote', 'Adds a test vote to specified poll')
  .action(function(args, callback) {
    this.prompt([
      {
        type: 'input',
        name: 'pollId',
        message: 'Please enter the polls id you want to update: ',
      },
      {
        type: 'input',
        name: 'userNumber',
        message: 'Please enter the phone number you want to use: ',
      },
      {
        type: 'input',
        name: 'vote',
        message: 'Please enter your vote: ',
      },
    ], (answers) => {
      const user = new User();
      user.phoneNumber = answers.userNumber;
      user.pollId = answers.pollId;
      user.vote = [answers.vote];
      user.save();
      callback();
    });
  });

cli
  .command('viewAllPolls', 'Shows all polls')
  .action(function(args, callback) {
    request.get(PollBaseUrlTest, (err, res, body) => {
      if (err) {
        this.log(err);
        return callback();
      }
      this.log(prettyjson.render(JSON.parse(body)));
      callback();
    });
  });

cli
  .command('viewAllVotes', 'Shows all votes')
  .action(function(args, callback) {
    const options = {
      url: VoteBaseUrlTest,
      auth: {
        username: 'admin',
        password: process.env.PASSWORD,
      },
    };
    request.get(options, (err, res, body) => {
      if (err) {
        this.log(err);
        return callback();
      }
      this.log(prettyjson.render(JSON.parse(body)));
      callback();
    });
  });

cli
  .command('deleteAllPolls', 'Deletes all polls')
  .action(function(args, callback) {
    this.prompt({
      type: 'input',
      name: 'confirmation',
      message: 'Are you sure you want to input all polls, \'y\' or \'n\': ',
    },
    (answers) => {
      if (answers.confirmation.toLowerCase() === 'n') return callback();
      const options = {
        url: PollBaseUrlTest,
        auth: {
          username: 'admin',
          password: process.env.PASSWORD,
        },
      };

      request.delete(options, (err) => {
        if (err) {
          this.log(err);
          return callback();
        }
        this.log('Success');
        callback();
      });
    });
  });

cli
  .command('deleteAllVotes', 'Deletes all votes')
  .action(function(args, callback) {
    this.prompt({
      type: 'input',
      name: 'confirmation',
      message: 'Are you sure you want to delete all votes, \'y\' or \'n\': ',
    },
    (answers) => {
      if (answers.confirmation.toLowerCase() === 'n') return callback();
      const options = {
        url: VoteBaseUrlTest,
        auth: {
          username: 'admin',
          password: process.env.PASSWORD,
        },
      };

      request.delete(options, (err) => {
        if (err) {
          this.log(err);
          return callback();
        }
        this.log('Success');
        callback();
      });
    });
  });

function renderTally(results) {
  const chart = new Pie(10, [], { legend: true });

  if (Object.keys(results.votes).length === 0) {
    return 'No votes have been cast';
  }

  const colorPalette = randomcolor({
    format: 'rgbArray',
    seed: results.seed,
    count: results.choices.length,
  });

  results.choices.forEach((choice, index) => {
    chart.add({
      label: choice,
      value: results.votes[choice] || 0,
      color: colorPalette[index],
    });
  });

  return chart.toString();
}

cli
  .command('showResults', 'Show the results of the current poll')
  .action(function(args, callback) {
    request.get(`${VoteBaseUrlTest}tally`, (err, res, body) => {
      if (err) {
        this.log(err);
        return callback();
      }

      if (res.statusCode === 404) {
        this.log(chalk.red.bold('There is no poll currently in progress'));
        return callback();
      }

      const results = JSON.parse(body);
      this.log(renderTally(results));
      callback();
    });
  });

cli
  .command(
    'showRealtimeResults',
    'Show the results of the current poll and keep them updated in real time'
  )
  .action(function(args, callback) {
    // Get the initial tally
    request.get(`${VoteBaseUrlTest}tally`, (err, res, body) => {
      if (err) {
        this.log(err);
        return callback();
      }

      if (res.statusCode === 404) {
        this.log(chalk.red.bold('There is no poll currently in progress'));
        return callback();
      }

      const results = JSON.parse(body);
      process.stdout.write('\u001bc');
      this.log(renderTally(results));

      // Subscribe to tally updates
      const es = new EventSource(`${VoteBaseUrlTest}tally/stream`);

      es.addEventListener('message', (e) => {
        const data = JSON.parse(e.data);
        if (data === 'heartbeat') return;

        // Clear the console
        process.stdout.write('\u001bc');
        this.log(renderTally(JSON.parse(data)));
      }, false);
    });
  });

cli
  .delimiter('real-votes-admin$ ')
  .show();
