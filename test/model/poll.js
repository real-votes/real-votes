const chai = require('chai').expect;
const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost/votes-real-test');

const Poll = require('../../model/poll');

describe('Model', () => {
  describe('Poll', () => {
    beforeEach(() => {
      return new Poll({
        pollName: 'test poll',
        pollStatus: 'in_progress',
        choices: ['yes', 'no'],
      }).save();
    });

    afterEach(() => Poll.remove({}));

    it('Create poll and add votes', () => {
      return Poll.update({ pollStatus: 'in_progress' },
        {
          $push: {
            votes: {
              phoneNumber: '2063723323',
              vote: 'yes',
            },
          },
        }
      ).then(() => {
        return Poll.update({ pollStatus: 'in_progress' },
          {
            $push: {
              votes: {
                phoneNumber: 'testNumber',
                vote: 'no',
              },
            },
          }
        );
      });
    });
  });
});
