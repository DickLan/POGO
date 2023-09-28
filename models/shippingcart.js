'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class ShippingCart extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  ShippingCart.init({
    user_id: DataTypes.INTEGER,
    account_id: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'ShippingCart',
    tableName: 'ShippingCarts',
    underscored: true,
  });
  return ShippingCart;
};