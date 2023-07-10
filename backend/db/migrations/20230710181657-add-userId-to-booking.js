'use strict';

let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA
}

options.tableName = 'Bookings'


/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {

    await queryInterface.addColumn(options, 'userId', {
      type: Sequelize.INTEGER,
      references: {
        model: 'Users',
        key: 'id'
      },
      onDelete: 'CASCADE',
      hooks: true
    })
  },

  async down(queryInterface, Sequelize) {

    await queryInterface.removeColumn(options, 'userId')
  }
};
