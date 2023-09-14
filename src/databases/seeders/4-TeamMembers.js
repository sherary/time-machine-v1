'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    return await queryInterface.bulkInsert('TeamMembers', [{
      teamID: 1,
      userID: 1,
      status: 'Pending',
      createdAt: new Date(),
      updatedAt: new Date()
    }, {
      teamID: 1,
      userID: 2,
      status: 'Pending',
      createdAt: new Date(),
      updatedAt: new Date()
    }])
  },

  async down (queryInterface, Sequelize) {
    return await queryInterface.bulkDelete('TeamMembers', null, {});
  }
};
