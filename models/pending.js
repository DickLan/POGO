'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Pending extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Pending.init({
    userId: DataTypes.INTEGER,
    accountId: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'Pending',
    tableName: 'Pendings',
    underscored: true,
  });
  return Pending;
};