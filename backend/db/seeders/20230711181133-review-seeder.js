'use strict';

const { Review } = require('../models');

/** @type {import('sequelize-cli').Migration} */

let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA
}

module.exports = {
  async up(queryInterface, Sequelize) {

    await Review.bulkCreate([
      {
        'spotId': '1',
        'userId': '1',
        'review': 'It was nice!',
        'stars': '2'
      },
      {
        'spotId': '1',
        'userId': '1',
        'review': 'It was nice!',
        'stars': '4'
      },
      {
        'spotId': '2',
        'userId': '1',
        'review': 'It was nice!',
        'stars': '4'
      },
      {
        'spotId': '2',
        'userId': '1',
        'review': 'It was nice!',
        'stars': '5'
      },
      {
        'spotId': '3',
        'userId': '2',
        'review': 'It was nice!',
        'stars': '3'
      },
      {
        'spotId': '3',
        'userId': '2',
        'review': 'It was nice!',
        'stars': '4'
      },
      {
        'spotId': '4',
        'userId': '2',
        'review': 'It was nice!',
        'stars': '4'
      },
      {
        'spotId': '4',
        'userId': '2',
        'review': 'It was nice!',
        'stars': '4'
      },
      {
        'spotId': '5',
        'userId': '3',
        'review': 'It was nice!',
        'stars': '2'
      },
      {
        'spotId': '5',
        'userId': '3',
        'review': 'It was nice!',
        'stars': '4'
      },

    ], { validate: true })
  },

  async down(queryInterface, Sequelize) {

    options.tableName = ('Reviews');
    return queryInterface.bulkDelete(options)
  }
};
