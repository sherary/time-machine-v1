const Joi = require('joi');
const { PAYLOAD } = require('../../../helpers/Constants');

const teamID = Joi.number().min(PAYLOAD.ID.MIN).max(PAYLOAD.ID.MAX);
const name = Joi.string().min(PAYLOAD.MIN_STRING).max(PAYLOAD.NAME.MAX);
const description = Joi.string().min(PAYLOAD.MIN_STRING).max(PAYLOAD.TEXT.MAX);

const IDSchema = Joi.object({
    teamID: teamID.required(),
});

const CreateSchema = Joi.object({
    name: name.required(),
    description: description,
}).options({ abortEarly: false });

const UpdateSchema = Joi.object({
    name: name,
    description: description,
}).options({ abortEarly: false });

module.exports = { IDSchema, CreateSchema, UpdateSchema };