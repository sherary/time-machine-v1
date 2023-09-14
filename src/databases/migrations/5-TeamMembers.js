'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('TeamMembers', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER(10)
      },

      teamID: {
        type: Sequelize.INTEGER(10),
        allowNull: false,
        references: {
          model: 'Teams',
          key: 'id',
        },
        onDelete: 'cascade'
      },

      userID: {
        type: Sequelize.INTEGER(10),
        allowNull: false,
        references: {
          model: 'Users',
          key: 'id'
        },
        onDelete: 'cascade'
      },

      status: {
        type: Sequelize.ENUM('Pending', 'Accepted', 'Blocked'),
        allowNull: false,
        defaultValue: 'Pending'
      },

      contributions: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 0
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
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('Members');
  }
};