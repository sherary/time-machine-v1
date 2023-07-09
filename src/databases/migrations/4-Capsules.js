'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Capsules', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER(10)
      },
  
      userID: {
        type: Sequelize.INTEGER(10),
        allowNull: false
      },
  
      jointID: {
        type: Sequelize.INTEGER(10),
        allowNull: true,
      },
  
      teamID: {
        type: Sequelize.INTEGER(10),
        allowNull: true
      },
  
      comment_cluster_ID: {
        type: Sequelize.STRING(50),
        allowNull: true,
      },
  
      title: {
        type: Sequelize.STRING(100),
        allowNull: false
      },
  
      content: {
        type: Sequelize.TEXT,
        allowNull: false
      },
  
      pictures: {
        type: Sequelize.STRING,
        allowNull: true
      },
  
      sound: {
        type: Sequelize.STRING,
        allowNull: true
      },
  
      video: {
        type: Sequelize.STRING,
        allowNull: true
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
    await queryInterface.dropTable('Capsules');
  }
};