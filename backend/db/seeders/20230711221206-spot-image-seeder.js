'use strict';

const { SpotImage }  = require('../models')

/** @type {import('sequelize-cli').Migration} */

let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA
}

module.exports = {
  async up (queryInterface, Sequelize) {
    /**
     * Add seed commands here.
     *
     * Example:
     * await queryInterface.bulkInsert('People', [{
     *   name: 'John Doe',
     *   isBetaMember: false
     * }], {});
    */

    await SpotImage.bulkCreate([
      {
        'spotId': '1',
        'url': 'www.moreurls.com',
        'preview': 'true'
      },
      {
        'spotId': '1',
        'url': 'www.nopreviewurl.com',
        'preview': 'false'
      },
      {
        'spotId': '2',
        'url' : 'www.urlurl.com',
        'preview': 'false'
      },
      {
        'spotId': '2',
        'url' : 'www.aurlhere.com',
        'preview' : 'true'
      }
    ],{validate: true})
  },

  async down (queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */

    options.tableName = ('SpotImages');
    const Op = Sequelize.Op;
    return queryInterface.bulkDelete(options, {
      id: {
        [Op.in]: [1,2]
      }
    },{})
  }
};
