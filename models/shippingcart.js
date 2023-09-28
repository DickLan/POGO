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
      ShippingCart.belongsTo(models.User, { foreignKey: 'user_id' })
      ShippingCart.belongsTo(models.Account, { foreignKey: 'account_id' })
    }
  }
  ShippingCart.init({
    user_id: {
      type: DataTypes.INTEGER,
      references: {
        model: 'User',
        key: 'id'
      }
    },
    account_id: {
      type: DataTypes.INTEGER,
      references: {
        model: 'Account',
        key: 'id'
      }
    }
  }, {
    sequelize,
    modelName: 'ShippingCart',
    tableName: 'ShippingCarts',
    underscored: true,
  });
  return ShippingCart;
};