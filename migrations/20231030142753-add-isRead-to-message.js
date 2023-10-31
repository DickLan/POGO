'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn('Messages', 'is_read_admin', {
      type: Sequelize.BOOLEAN,
      allowNull: true,
      defaultValue: false
    })
    await queryInterface.addColumn('Messages', 'is_read_user', {
      type: Sequelize.BOOLEAN,
      allowNull: true,
      defaultValue: false
    })
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn('Messages', 'is_read_admin')
    await queryInterface.removeColumn('Messages', 'is_read_user')
  }
};
