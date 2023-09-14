'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    return await queryInterface.bulkInsert('Teams', [{
        creatorID: 1,
        name: "Test Title",
        description: "Test description",
        createdAt: new Date(),
        updatedAt: new Date()
    }])
  },

  async down (queryInterface, Sequelize) {
    return await queryInterface.bulkDelete('Teams', null, {});
  }
};
