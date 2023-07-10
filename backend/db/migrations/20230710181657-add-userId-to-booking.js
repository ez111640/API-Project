'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {

    await queryInterface.addColumn('Bookings', 'userId', {
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

    await queryInterface.removeColumn('Bookings', 'userId')
  }
};
