'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Account extends Model {
    static associate(models) {
      Account.belongsToMany(models.User, {
        through: models.Pending,
        foreignKey: 'accountId',
        as: 'FendingUsers'
      })
    }
  }
  Account.init({
    name: DataTypes.STRING,
    contentsIv100: DataTypes.STRING,
    contentsLegend: DataTypes.STRING,
    accountId: DataTypes.INTEGER,
    stardust: DataTypes.INTEGER,
    level: DataTypes.INTEGER,
    team: DataTypes.STRING,
    description: DataTypes.STRING,
    image: DataTypes.STRING,
    youtube: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Account',
    tableName: 'Accounts',
    underscored: true,
  });
  return Account;
};