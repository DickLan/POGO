'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert('Counters', [
      {
        name: 'counterNoLimit',
        counts1: 0,
        counts2: 0,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        name: 'counterCheckIP',
        counts1: 0,
        counts2: 0,
        created_at: new Date(),
        updated_at: new Date()
      }
    ])
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('Counters', {})
  }
};
