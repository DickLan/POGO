'use strict';
const {
  Model, INTEGER
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Account extends Model {
    static associate(models) {
      // console.log(models)
      // 問題出在這 
      Account.belongsToMany(models.User, {
        through: models.Cart,
        foreignKey: 'accountId',
        as: 'CartUsers'
      })
    }
  }
  Account.init({
    name: DataTypes.STRING,
    contentsIv100: DataTypes.STRING,
    contentsLegend: DataTypes.STRING,
    accountId: DataTypes.STRING,
    stardust: DataTypes.INTEGER,
    level: DataTypes.INTEGER,
    team: DataTypes.STRING,
    description: DataTypes.STRING,
    image: DataTypes.STRING,
    youtube: DataTypes.STRING,
    price: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'Account',
    tableName: 'Accounts',
    underscored: true,
  });
  return Account;
};