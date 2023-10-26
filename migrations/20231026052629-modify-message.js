'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.removeColumn('Messages', 'direction');
    await queryInterface.addColumn('Messages', 'receiver_id', {
      type: Sequelize.INTEGER,
      allowNull: false,
      references: {
        model: 'Users',
        key: 'id'
      },

    });
    await queryInterface.addColumn('Messages', 'sender_id', {
      type: Sequelize.INTEGER,
      allowNull: false,
      references: {
        model: 'Users',
        key: 'id'
      },

    })

  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn('Messages', 'receiver_id');
    await queryInterface.removeColumn('Messages', 'sender_id');
    await queryInterface.addColumn('Messages', 'direction', {
      type: Sequelize.ENUM('to_admin', 'from_admin')
    })
  }
};
