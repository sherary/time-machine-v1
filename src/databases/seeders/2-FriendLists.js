'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up (queryInterface, Sequelize) {
        return await queryInterface.bulkInsert('Friends', [{
            userID: 1,
            createdAt: new Date(),
            updatedAt: new Date(),
        }, {
            userID: 2,
            createdAt: new Date(),
            updatedAt: new Date(),
        }])
    },

    async down (queryInterface, Sequelize) {
        return await queryInterface.bulkDelete('Friends', null, {});
    }
};
