'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Quizzes', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      name: {
        type: Sequelize.STRING
      },
      createdById: {
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
      'Quizzes',
      'statusId',
      {
        type: Sequelize.INTEGER,
        references: {
          model: 'Status',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL',
      }
    )
    await queryInterface.addColumn(
      'Quizzes',
      'topicId',
      {
        type: Sequelize.INTEGER,
        references: {
          model: 'Topic',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL',
      }
    )
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn('Quizzes', 'statusId');
    await queryInterface.removeColumn('Quizzes', 'topicId');
    await queryInterface.dropTable('Quizzes');
  }
};