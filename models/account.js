'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Account extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Account.init({
    name: DataTypes.STRING,
    contents_iv100: DataTypes.STRING,
    contents_legend: DataTypes.STRING,
    acct_id: DataTypes.INTEGER,
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