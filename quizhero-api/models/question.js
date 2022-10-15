'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Question extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      this.belongsTo(models.Quiz)
    }
  }
  Question.init({
    text: DataTypes.STRING,
    choice0: DataTypes.STRING,
    choice1: DataTypes.STRING,
    choice2: DataTypes.STRING,
    choice3: DataTypes.STRING,
    correctChoiceIndex: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'Question',
  });
  return Question;
};