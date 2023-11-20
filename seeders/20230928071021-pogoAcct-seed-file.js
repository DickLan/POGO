'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert('Accounts',
      Array.from({ length: 5 }, (_, i) => ({
        stardust: 30,
        level: 40,
        team: 'red',
        price: 55555,
        contents_iv100: `噴火龍／火伊布／飛腿郎／大蔥鴨／打擊鬼／尼偶小人／單首龍／電擊獸／幼基拉斯／飛天螳螂／黑魯加／電龍／投摔鬼／頭蓋龍／三合一磁怪／鯉魚王／迷你龍／`,
        contents_legend: '超夢／烈空座／波克雞絲／火焰鳥／拉帝歐斯／騎拉帝納／固拉多／藏馬然特／洛奇雅／傑克羅姆',
        account_id: `B0${i}`,
        description: '留空',
        created_at: new Date(),
        updated_at: new Date(),
        youtube: 'https://www.youtube.com/watch?v=MuWxK1_L1U8'

      }))
    );
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('Accounts', {});
  }
};
