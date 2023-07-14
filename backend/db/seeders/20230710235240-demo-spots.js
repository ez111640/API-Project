'use strict';

const { Spot } = require('../models');

let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA
}

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {

    await Spot.bulkCreate([
      {

        ownerId: 1,
        address: '1111 This Street',
        city: 'Our City',
        state: 'WV',
        country: 'United States',
        lat: '82.34',
        lng: '123.5',
        name: 'Spot One Owner 1',
        description: 'The first Air BnB Spot',
        price: '124.55'
      },

      {
        ownerId: 1,
        address: '2222 This Street',
        city: 'Our City',
        state: 'WV',
        country: 'United States',
        lat: '82.34',
        lng: '123.5',
        name: 'Spot 2 Owner 1',
        description: 'The first Air BnB Spot',
        price: '124.55'
      },


      {
        ownerId: 2,
        address: '3333 This Street',
        city: 'Our City',
        state: 'WV',
        country: 'United States',
        lat: '82.34',
        lng: '123.5',
        name: 'Spot 3 Owner 2',
        description: 'The first Air BnB Spot',
        price: '124.55'
      },

      {
        ownerId: 2,
        address: '4444 This Street',
        city: 'Our City',
        state: 'WV',
        country: 'United States',
        lat: '82.34',
        lng: '123.5',
        name: 'Spot 4 Owner 2',
        description: 'The first Air BnB Spot',
        price: '124.55'
      },

      {
        ownerId: 3,
        address: '5555 This Street',
        city: 'Our City',
        state: 'WV',
        country: 'United States',
        lat: '82.34',
        lng: '123.5',
        name: 'Spot 5 Owner 3',
        description: 'The first Air BnB Spot',
        price: '124.55'
      },

      {
        ownerId: 3,
        address: '6666 This Street',
        city: 'Our City',
        state: 'WV',
        country: 'United States',
        lat: '82.34',
        lng: '123.5',
        name: 'Spot 6 Owner 3',
        description: 'The first Air BnB Spot',
        price: '124.55'
      },

      {
        ownerId: 4,
        address: '7777 This Street',
        city: 'Our City',
        state: 'WV',
        country: 'United States',
        lat: '82.34',
        lng: '123.5',
        name: 'Spot 7 Owner 4',
        description: 'The first Air BnB Spot',
        price: '124.55'
      },

      {
        ownerId: 4,
        address: '8888 This Street',
        city: 'Our City',
        state: 'WV',
        country: 'United States',
        lat: '82.34',
        lng: '123.5',
        name: 'Spot 4 Owner 8',
        description: 'The first Air BnB Spot',
        price: '124.55'
      },
    ], {
      validate: true
    });
  },

  async down(queryInterface, Sequelize) {
    options.tableName = ('Spots');
    return queryInterface.bulkDelete(options)
  }
};
