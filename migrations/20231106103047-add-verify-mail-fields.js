'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn('Users', 'mail_is_verified', {
      type: Sequelize.BOOLEAN,
      allowNull: true,
      defaultValue: false
    });
    await queryInterface.addColumn('Users', 'verify_mail_token', {
      type: Sequelize.STRING,
      allowNull: true
    });

    await queryInterface.addColumn('Users', 'verify_mail_expires', {
      type: Sequelize.DATE,
      allowNull: true,
    });


  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn('Users', 'mail_is_verified');
    await queryInterface.removeColumn('Users', 'verify_mail_token');
    await queryInterface.removeColumn('Users', 'verify_mail_expires');
  }

};
