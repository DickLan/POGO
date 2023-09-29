'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert('Accounts',
      Array.from({ length: 5 }, () => ({
        stardust: 30,
        level: 40,
        team: 'red',
        price: 55555,
        contents_iv100: `噴火龍／火伊布／飛腿郎／大蔥鴨／打擊鬼／尼偶小人／單首龍／電擊獸／幼基拉斯／飛天螳螂／黑魯加／電龍／投摔鬼／頭蓋龍／三合一磁怪／鯉魚王／迷你龍／`,
        contents_legend: '傳說佬／三三三',
        account_id: 'B01',
        description: '留空',
        created_at: new Date(),
        updated_at: new Date(),
        youtube: 'https://www.youtube.com/watch?v=fUNIR1GANHA'

      })
      )
    )
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('Accounts', {})
  }
};
