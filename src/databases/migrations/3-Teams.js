'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Teams', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER(10)
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

      lists: {
        type:Sequelize.JSON(),
        allowNull: false,
        defaultValue: {}
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
    await queryInterface.dropTable('Teams');
  }
};