'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Questions', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      text: {
        type: Sequelize.STRING
      },
      choice0: {
        type: Sequelize.STRING
      },
      choice1: {
        type: Sequelize.STRING
      },
      choice2: {
        type: Sequelize.STRING
      },
      choice3: {
        type: Sequelize.STRING
      },
      correctChoiceIndex: {
        type: Sequelize.INTEGER
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
    await queryInterface.addColumn(
      'Questions',
      'quizId',
      {
        type: Sequelize.INTEGER,
        references: {
          model: 'Quizzes',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL',
      }
    )
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn('Questions', 'quizId');
    await queryInterface.dropTable('Questions');
  }
};