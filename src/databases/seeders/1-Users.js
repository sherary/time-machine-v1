'use strict';
const { faker } = require('@faker-js/faker');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up (queryInterface, Sequelize) {
        return queryInterface.bulkInsert('Users', [{
            name: faker.person.fullName(),
            dob: faker.date.birthdate(),
            username: faker.internet.userName({ min: 4, max: 20 }),
            email: faker.internet.email(40),
            password: faker.internet.password(100),
            role: 1,
            createdAt: new Date(),
            updatedAt: new Date(),
        }, {
            name: faker.person.fullName(),
            dob: faker.date.birthdate(),
            username: faker.internet.userName(20),
            email: faker.internet.email(40),
            password: faker.internet.password(100),
            role: 2,
            createdAt: new Date(),
            updatedAt: new Date(),
        }])
    },

    async down (queryInterface, Sequelize) {
        return queryInterface.bulkDelete('Users', null, {});
    }
};
