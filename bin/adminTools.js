#!/usr/bin/env node
'use strict';

const program = require('inquirer');
const request = require('request');

const addPollBaseUrl = 'https://real-votes.herokuapp.com/api/poll';
const addPollBaseUrlTest = 'http://localhost:3141/api/poll';

console.log('Hello welcome to the real-votes admin console.');

const adminOptionsPrompt = {
  type: 'list',
  name: 'requestType',
  message: 'What would you like to do?',
  choices: ['addPoll', 'updatePollStatus', 'exit'],
};

const addPollQuestions = [
  {
    type: 'input',
    name: 'pollName',
    message: 'What would you like to name your poll?',
  },
];

function addPoll() {
  program.prompt(addPollQuestions).then((answers) => {
    JSON.stringify(answers, null, '  ');

    const options = {
      url: addPollBaseUrlTest,
      json: { pollName: answers.pollName },
      auth: {
        username: 'admin',
        password: process.env.PASSWORD,
      },
    };
    console.log(options);
    request.post(options, (err) => {
      if (err) return console.log(err);
      return console.log('Success!');
    });
  });
}

function chooseOption() {
  program.prompt(adminOptionsPrompt).then((answers) => {
    if (answers.requestType === 'addPoll') {
      console.log('You choose %s ', answers.requestType);
      addPoll();
    }
    if (answers.requestType === 'updatePollStatus') {
      console.log('You choose %s ', answers.requestType);
    }
    if (answers.requestType === 'exit') {
      process.exit();
    }
  });
}

chooseOption();
