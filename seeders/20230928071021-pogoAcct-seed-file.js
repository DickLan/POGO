'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert('Accounts',
      Array.from({ length: 5 }, () => ({
        stardust: 30,
        level: 40,
        team: 'r',
        contents_iv100: '大隻佬／二二二',
        contents_legend: '傳說佬／三三三',
        acct_id: 'B01',
        description: '圓陸鯊／過動員／噴火龍／永基拉／妙蛙種子／智輝猩／波克基古／鬼斯／單首龍／鯉魚王／飛腿郎／妙蛙花／拉魯拉斯／尼多王／甲殼龍／三合一磁怪／菊草葉／火球鼠',
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
