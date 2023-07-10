'use strict';

const { query } = require('express-validator');

/** @type {import('sequelize-cli').Migration} */

let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA
}

options.tableName = 'Bookings'

module.exports = {
  async up(queryInterface, Sequelize) {
    /**
     * Add altering commands here.
     *
     * Example:
     * await queryInterface.createTable('users', { id: Sequelize.INTEGER });
     */
    await queryInterface.addColumn(options, 'spotId', {
      type: Sequelize.INTEGER,
      references: {
        model: 'Spots',
        key: 'id'
      },
      onDelete: 'CASCADE',
      hooks: true
    })
  },

  async down(queryInterface, Sequelize) {
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */
    await queryInterface.removeColumn(options, 'spotId')
  }
};
