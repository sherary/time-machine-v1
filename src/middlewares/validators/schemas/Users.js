const Joi = require('joi');
const { PAYLOAD } = require('../../../helpers/Constants');

const name = Joi.string().min(PAYLOAD.MIN_STRING).max(PAYLOAD.NAME.MAX)
const dob = Joi.string().min(PAYLOAD.MIN_STRING).max(PAYLOAD.DOB.MAX)
const username = Joi.string().min(PAYLOAD.MIN_STRING).max(PAYLOAD.USERNAME.MAX)
const email = Joi.string().min(PAYLOAD.MIN_STRING).max(PAYLOAD.EMAIL.MAX).email({ minDomainSegments: 2, tlds: { allow: ['com', 'id']}})
const password = Joi.string().min(PAYLOAD.MIN_STRING).max(PAYLOAD.PASSWORD.MAX)
const user_id = Joi.number().integer().min(PAYLOAD.ID.MIN).max(PAYLOAD.ID.MAX).required()

const CreateSchema = Joi.object({
    name: name.required(),
    dob: dob,
    username: username,
    email: email.required(),
    password: password.required(),
}).options({ abortEarly: false });

const IDSchema = Joi.object({
    user_id: user_id
});

const UpdateSchema = Joi.object({
    name: name,
    dob: dob,
    username: username,
    email: email,
    password: password,
}).options({ abortEarly: false });

const LoginSchema = Joi.object({
    email: email,
    username: username,
    password: password.required(),
}).xor('email', 'username').options({ abortEarly: false });

module.exports = { CreateSchema, IDSchema, UpdateSchema, LoginSchema }