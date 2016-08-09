#real-votes

Real time voting via SMS


#Summary

real-votes is a real time voting SMS voting API developed in NodeJS, utilizing ExpressJS and MongoDB The platform is hosted on Heroku and uses Twilio as a middleware to send/recieve texts.


#Administration

Administrators can use the real-votes-admin console to create and modify polls. Once a poll is set to `in_progress` users can then vote on that poll via our Twilio virtual number.


The real votes-admin-console can be found here:

https://www.npmjs.com/package/real-votes-admin


#Tests

1. Clone down this repository.

2. Enter the following command to install dependencies: `npm i`.

3. Start mongod: `mongod --dbpath db`
