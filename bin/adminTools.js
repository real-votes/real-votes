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

const green = chalk.bold.green;
const red = chalk.bold.red;
const blue = chalk.bold.blue;
const title = chalk.bold.underline.yellow;

const mongoServer = process.env.MONGODB_URI || 'mongodb://localhost/pollDatabase';
mongoose.connect(mongoServer);

console.log(title('Hello, welcome to the real-votes admin console'));

const cli = vorpal();

function inputVer(promptInput) {
  let badInput = false;
  Object.keys(promptInput).forEach((key) => {
    if (promptInput[key] === '') {
      badInput = true;
    }
  });
  return badInput;
}

cli
  .command('addPoll', 'Creates a new poll')
  .action(function(args, callback) {
    this.prompt([
      {
        type: 'input',
        name: 'pollName',
        message: blue('What would you like to name your poll? '),
      },
      {
        type: 'input',
        name: 'choices',
        message: blue('Please enter your choices for this poll: '),
      },
      {
        type: 'input',
        name: 'votesPerUser',
        message: blue('Please enter your max votes for this poll: '),
      },
    ], (answers) => {
      const input = inputVer(answers);
      if (input === true) {
        this.log(red('Invalid input, exiting command...'));
        return callback();
      }

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

      request.post(options, (err, res) => {
        if (err) {
          this.log(err);
          return callback();
        }

        if (res.statusCode !== 200) {
          this.log(red('Invalid input, exiting command...'));
          return callback();
        }

        this.log(green('Successfully added poll!'));
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
        message: blue('Please enter the polls id you want to update: '),
      },
      {
        type: 'input',
        name: 'pollStatus',
        message: blue('Please enter the status you want to set: '),
      },
    ], (answers) => {
      const input = inputVer(answers);
      if (input === true) {
        this.log(red('Invalid input, exiting command...'));
        return callback();
      }

      const options = {
        url: PollBaseUrlTest + answers.id,
        json: { pollStatus: answers.pollStatus },
        auth: {
          username: 'admin',
          password: process.env.PASSWORD,
        },
      };

      request.put(options, (err, res) => {
        if (err) {
          this.log(err);
          return callback();
        }

        if (res.statusCode !== 200) {
          this.log(red('Invalid input, exiting command...'));
          return callback();
        }

        this.log(green('Successfully updated poll!'));
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
          message: blue('Please enter the polls ID you want to delete: '),
        },
      ], (answers) => {
        const input = inputVer(answers);
        if (input === true) {
          this.log(red('Invalid input, exiting command...'));
          return callback();
        }

        const options = {
          url: PollBaseUrlTest + answers.id,
          auth: {
            username: 'admin',
            password: process.env.PASSWORD,
          },
        };

        request.delete(options, (err, res) => {
          if (err) {
            this.log(err);
            return callback();
          }

          if (res.statusCode !== 200) {
            this.log(red('Invalid input, exiting command...'));
            return callback();
          }

          this.log(green('Successfully deleted poll!'));
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
        message: blue('Please enter the polls id you want to add a vote to: '),
      },
      {
        type: 'input',
        name: 'userNumber',
        message: blue('Please enter the phone number you want to use: '),
      },
      {
        type: 'input',
        name: 'vote',
        message: blue('Please enter your vote: '),
      },
    ], (answers) => {
      const input = inputVer(answers);
      if (input === true) {
        this.log(red('Invalid input, exiting command...'));
        return callback();
      }

      const user = new User();
      user.phoneNumber = answers.userNumber;
      user.pollId = answers.pollId;
      user.vote = [answers.vote];
      user.save()
      .then(() => {
        this.log(green('Successfully added vote'));
        callback();
      })
      .catch((err) => {
        this.log(err);
        callback();
      });
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

      if (res.statusCode !== 200) {
        this.log(red('Invalid input, exiting command...'));
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

      if (res.statusCode !== 200) {
        this.log(red('Invalid input, exiting command...'));
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
      message: red('Are you sure you want to input all polls, \'y\' or \'n\': '),
    },
    (answers) => {
      const input = inputVer(answers);
      if (input === true) {
        this.log(red('Invalid input, exiting command...'));
        return callback();
      }

      if (answers.confirmation.toLowerCase() === 'n') return callback();
      const options = {
        url: PollBaseUrlTest,
        auth: {
          username: 'admin',
          password: process.env.PASSWORD,
        },
      };

      request.delete(options, (err, res) => {
        if (err) {
          this.log(err);
          return callback();
        }

        if (res.statusCode !== 200) {
          this.log(red('Invalid input, exiting command...'));
          return callback();
        }

        this.log(green('Successfully deleted all polls.'));
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
      message: red('Are you sure you want to delete all votes, \'y\' or \'n\': '),
    },
    (answers) => {
      const input = inputVer(answers);
      if (input === true) {
        this.log(red('Invalid input, exiting command...'));
        return callback();
      }

      if (answers.confirmation.toLowerCase() === 'n') return callback();
      const options = {
        url: VoteBaseUrlTest,
        auth: {
          username: 'admin',
          password: process.env.PASSWORD,
        },
      };

      request.delete(options, (err, res) => {
        if (err) {
          this.log(err);
          return callback();
        }

        if (res.statusCode !== 200) {
          this.log(red('Invalid input, exiting command...'));
          return callback();
        }

        this.log(green('Successfully deleted all votes.'));
        callback();
      });
    });
  });

cli
  .command('viewOnePollVotes', 'View votes for a single poll.')
  .action(function(args, callback) {
    this.prompt({
      type: 'input',
      name: 'pollId',
      message: blue('Enter the ID of the Poll you want to view votes for: '),
    },
    (answers) => {
      const input = inputVer(answers);
      if (input === true) {
        this.log(red('Invalid input, exiting command...'));
        return callback();
      }

      const options = {
        url: `${PollBaseUrlTest}${answers.pollId}/users`,
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

        if (res.statusCode !== 200) {
          this.log(red('Invalid input, exiting command...'));
          return callback();
        }

        this.log(prettyjson.render(JSON.parse(body)));
        callback();
      });
    });
  });

cli
  .command('deleteOnePollVotes', 'Delete votes for a single poll.')
  .action(function(args, callback) {
    this.prompt({
      type: 'input',
      name: 'pollId',
      message: blue('Enter the ID of the Poll you want to delete all votes for: '),
    },
    (answers) => {
      const input = inputVer(answers);
      if (input === true) {
        this.log(red('Invalid input, exiting command...'));
        return callback();
      }

      const options = {
        url: `${PollBaseUrlTest}${answers.pollId}/users`,
        auth: {
          username: 'admin',
          password: process.env.PASSWORD,
        },
      };

      request.delete(options, (err, res, body) => {
        if (err) {
          this.log(err);
          return callback();
        }

        if (res.statusCode !== 200) {
          this.log(red('Invalid input, exiting command...'));
          return callback();
        }

        this.log(prettyjson.render(JSON.parse(body)));
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
        this.log(red('There is no poll currently in progress'));
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
      } else {
        const results = JSON.parse(body);
        process.stdout.write('\u001bc');
        this.log(renderTally(results));
      }

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
