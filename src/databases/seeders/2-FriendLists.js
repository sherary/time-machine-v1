'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
      return await queryInterface.bulkInsert('FriendsLists', [{
          userID: 1,
          lists: '[{}]',
          createdAt: new Date(),
          updatedAt: new Date(),
      }, {
          userID: 2,
          lists: '[{}]',
          createdAt: new Date(),
          updatedAt: new Date(),
      }])
  },

  async down (queryInterface, Sequelize) {
      return await queryInterface.bulkDelete('FriendsLists', null, {});
  }
};
