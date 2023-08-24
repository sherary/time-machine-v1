'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Friends', {
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

      friendID: {
        type: Sequelize.INTEGER(10),
        allowNull: true,
        references: {
          model: 'Users',
          key: 'id'
        },
        onDelete: 'cascade'
      },

      status: {
        allowNull: false,
        type: Sequelize.ENUM('Pending', 'Accepted'),
        defaultValue: 'Pending'
      },

      capsule_total: {
        allowNull: false,
        type: Sequelize.INTEGER,
        defaultValue: 0,
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
    await queryInterface.dropTable('Friends');
  }
};