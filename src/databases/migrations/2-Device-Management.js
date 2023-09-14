'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('DeviceManagement', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
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

      agent: {
        type: Sequelize.STRING,
        allowNull: true
      },
  
      OS: {
        type: Sequelize.STRING,
        allowNull: true
      },
  
      location: {
        type: Sequelize.STRING,
        allowNull: true
      },
  
      last_login: {
        type: Sequelize.DATE,
        allowNull: true
      },
  
      isLoggedIn: {
        type: Sequelize.BOOLEAN,
        defaultValue: false,
        allowNull: false
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
    await queryInterface.dropTable('DeviceManagement');
  }
};