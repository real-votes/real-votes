![real-votes](./resources/realVotesLogo.png)

![travis-status](https://travis-ci.org/real-votes/real-votes.svg)

Real time voting via SMS

# Summary

real-votes is a real time voting service via SMS developed in NodeJS, utilizing ExpressJS and MongoDB. The service is hosted on Heroku and uses the Twilio API to send and receive texts.


# Administration

Administrators can use the real-votes-admin console to create and modify polls.

The real-votes-admin instructions for installation and usage can be found here [https://www.npmjs.com/package/real-votes-admin](https://www.npmjs.com/package/real-votes-admin)


# Tests

1. Clone down this repository:

    `git clone https://github.com/real-votes/real-votes.git`

2. Make a database directory for Mongo in the project root:

    `mkdir db`

3. Install NPM dependencies:

    `npm install`

4. Start MongoDB:

    `mongod --dbpath db/`

5. Run the tests with Gulp:

    `gulp test`
