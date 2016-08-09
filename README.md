![real-votes](./resources/realVotesLogo.png)

#real-votes
![travis-status](https://travis-ci.org/real-votes/real-votes.svg)

Real time voting via SMS


#Summary

real-votes is a real time voting SMS voting API developed in NodeJS, utilizing ExpressJS and MongoDB The platform is hosted on Heroku and uses Twilio as a middleware to send/recieve texts.


#Administration

Administrators can use the real-votes-admin console to create and modify polls. Once a poll is set to `in_progress` users can then vote on that poll via our Twilio virtual number.


The real votes-admin-console can be found here:

https://www.npmjs.com/package/real-votes-admin

#How to use real-votes-admin

1. npm install the package on the command line:

  `npm i -g real-votes-admin`

2. run the package:

  `realvotesadmin`

3. run the 'help' command:

  `help`

4. 'help' will print out a list of commands you can use to create, edit and delete polls. As well as displaying existing polls and their results in real time.


#Tests

1. Clone down this repository on github and in the command line write:

  `git clone`

2. Enter the following command to install dependencies:

  `npm i`

3. Start mongod:

  `mongod --dbpath db`

4. Run a gulp test on the command line in the root:

  `gulp test`
