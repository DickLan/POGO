'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Message extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Message.belongsTo(models.User, { foreignKey: 'senderId', as: 'sender' });
      Message.belongsTo(models.User, { foreignKey: 'receiverId', as: 'receiver' })

    }
  }
  Message.init({
    userId: DataTypes.INTEGER,
    message: DataTypes.TEXT,
    senderId: DataTypes.INTEGER,
    receiverId: DataTypes.INTEGER,
    isRead: DataTypes.BOOLEAN
  }, {
    sequelize,
    modelName: 'Message',
    tableName: 'Messages',
    underscored: true,
  });
  return Message;
};