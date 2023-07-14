'use strict';

const { ReviewImage } = require('../models');


/** @type {import('sequelize-cli').Migration} */

let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA
}

module.exports = {
  async up(queryInterface, Sequelize) {
    /**
     * Add seed commands here.
     *
     * Example:
     * await queryInterface.bulkInsert('People', [{
     *   name: 'John Doe',
     *   isBetaMember: false
     * }], {});
    */
    await ReviewImage.bulkCreate([
      {
        'reviewId': '1',
        'url': 'www.thisurl.com'
      },
      {
        'reviewId': '1',
        'url': 'www.someotherurl.com'
      },
      {
        'reviewId': '2',
        'url': 'www.thisurl.com'
      },
      {
        'reviewId': '2',
        'url': 'www.someotherurl.com'
      },
      {
        'reviewId': '3',
        'url': 'www.thisurl.com'
      },
      {
        'reviewId': '3',
        'url': 'www.someotherurl.com'
      },

      {
        'reviewId': '4',
        'url': 'www.thisurl.com'
      },
      {
        'reviewId': '4',
        'url': 'www.someotherurl.com'
      },

      {
        'reviewId': '5',
        'url': 'www.thisurl.com'
      },
      {
        'reviewId': '5',
        'url': 'www.someotherurl.com'
      },
      {
        'reviewId': '6',
        'url': 'www.thisurl.com'
      },
      {
        'reviewId': '6',
        'url': 'www.someotherurl.com'
      },
    ], { validate: true })
  },

  async down(queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */

    options.tableName = ('ReviewImages');
    return queryInterface.bulkDelete(options)
  }
};
