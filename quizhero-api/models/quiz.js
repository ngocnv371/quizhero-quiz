'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Quiz extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      this.belongsTo(models.Topic, { as: 'topic', foreignKey: 'topicId' })
      this.belongsTo(models.Status, { as: 'status', foreignKey: 'statusId' })
    }
  }
  Quiz.init({
    name: DataTypes.STRING,
    createdById: DataTypes.INTEGER,
    createdAt: DataTypes.DATE,
    updatedAt: DataTypes.DATE
  }, {
    sequelize,
    modelName: 'Quiz',
    timestamps: true,
  });
  return Quiz;
};