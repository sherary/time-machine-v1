'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Users', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER(10)
      },
  
      name: {
        type: Sequelize.STRING(50),
        allowNull: false
      },

      dob: {
        type: Sequelize.DATE,
        allowNull: true
      },
  
      username: {
        type: Sequelize.STRING(20),
        allowNull: true
      },
  
      email: {
        type: Sequelize.STRING(40),
        allowNull: false
      },
  
      password: {
        type: Sequelize.STRING(100),
        allowNull: false
      },
  
      role: {
        type: Sequelize.ENUM(['admin','user']),
        allowNull: false,
        defaultValue: 'user'
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
    await queryInterface.dropTable('Users');
  }
};