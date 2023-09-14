'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up (queryInterface, Sequelize) {
        return await queryInterface.bulkInsert('Friends', [{
            userID: 1,
            friendID: 2,
            createdAt: new Date(),
            updatedAt: new Date(),
        }, {
            userID: 1,
            friendID: 3,
            createdAt: new Date(),
            updatedAt: new Date(),
        }, {
            userID: 1,
            friendID: 4,
            createdAt: new Date(),
            updatedAt: new Date(),
        }])
    },

    async down (queryInterface, Sequelize) {
        return await queryInterface.bulkDelete('Friends', null, {});
    }
};
