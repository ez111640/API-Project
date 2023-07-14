'use strict';

const { User } = require('../models');
const bcrypt = require("bcryptjs")

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

    await User.bulkCreate([
      {
        email: 'demo@user.io',
        username: 'Demo-lition',
        firstName: 'EmmaRain',
        lastName: 'Zimmerman',
        hashedPassword: bcrypt.hashSync('password'),
      },
      {
        email: 'user1@user1.io',
        username: 'FakeUser1',
        firstName: 'Erica',
        lastName: 'Zimmerman',
        hashedPassword: bcrypt.hashSync('password2'),
      },
      {
        email: 'user2@user2.io',
        username: 'FakeUser2',
        firstName: 'Kayla',
        lastName: 'Hatle',
        hashedPassword: bcrypt.hashSync('password3'),
      },
      {
        email: 'user3@user3.io',
        username: 'FakeUser3',
        firstName: 'Kayla',
        lastName: 'Hatle',
        hashedPassword: bcrypt.hashSync('password3'),
      }
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

    options.tableName = ('Users');
    return queryInterface.bulkDelete(options)
  }
};
