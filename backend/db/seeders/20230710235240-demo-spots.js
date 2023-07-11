'use strict';

const { Spot } = require('../models');

let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA
}

/** @type {import('sequelize-cli').Migration} */
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

    await Spot.bulkCreate([
      {
        ownerId: 1,
        address: '1234 This Street',
        city: 'Our City',
        state: 'WV',
        country: 'United States',
        lat: '82.34',
        lng: '123.5',
        name: 'First Spot',
        description: 'A lovely first Air BnB Spot',
        price: '124.55'
      },
      {
        ownerId: 1,
        address: '1234 This Street',
        city: 'Our City',
        state: 'WV',
        country: 'United States',
        lat: '82.34',
        lng: '123.5',
        name: 'First Spot',
        description: 'A lovely first Air BnB Spot',
        price: '124.55'
      },
    ], {
      validate: true
    });
  },

  async down(queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
    options.tableName = ('Spots');
    const Op = Sequelize.Op;
    return queryInterface.bulkDelete(options, {
      name: {
        [Op.in]: ['First Spot', 'Second Spot', 'Third Spot']
      }
    }, {})
  }
};
