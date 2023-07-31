'use strict';

const { SpotImage } = require('../models')

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

    await SpotImage.bulkCreate([
      {
        'spotId': '1',
        'url': "https://a0.muscache.com/im/pictures/miso/Hosting-13907376/original/2865c3b1-1530-4b19-ba52-eea49118b1cb.jpeg?im_w=1200",
        'preview': 'true'
      },

      {
        'spotId': '2',
        'url': "https://a0.muscache.com/im/pictures/5a32cbef-85dd-4f40-bfea-ee623e9b9ed6.jpg?im_w=1200",
        'preview': 'true'
      }
      ,
      {
        'spotId': '3',
        'url': 'https://a0.muscache.com/im/pictures/miso/Hosting-740070243718742779/original/5b9823fd-17c1-456f-b222-cd528ad1daa0.jpeg?im_w=1200',
        'preview': 'true'
      }
      ,
      {
        'spotId': '4',
        'url': 'https://a0.muscache.com/im/pictures/miso/Hosting-53583209/original/d1b8a6b2-88fc-4496-aaf7-a6cd3fb9a580.jpeg?im_w=1200',
        'preview': 'true'
      }
      ,
      {
        'spotId': '5',
        'url': "https://a0.muscache.com/im/pictures/miso/Hosting-868065558974184796/original/4101075a-ff9d-41fd-b001-ce0b7565be95.jpeg?im_w=1200",
        'preview': 'true'
      }
      ,
      {
        'spotId': '6',
        'url': "https://a0.muscache.com/im/pictures/5237aef4-5931-4bba-a20f-305b7c72ce8a.jpg?im_w=1200",
        'preview': 'true'
      }
      ,
      {
        'spotId': '7',
        'url': 'https://a0.muscache.com/im/pictures/07837065-dd21-4a90-9441-bcaf453e3440.jpg?im_w=1200',
        'preview': 'true'
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

    options.tableName = ('SpotImages');
    return queryInterface.bulkDelete(options)
  }
};
