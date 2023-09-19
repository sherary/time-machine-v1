const Joi = require('joi');
const { PAYLOAD } = require('../../../helpers/Constants');

const teamID = Joi.number().min(PAYLOAD.ID.MIN).max(PAYLOAD.ID.MAX);

const TeamIDSchema = Joi.object({
    teamID: teamID.required(),
});

const UserIDSchema = Joi.object({
    userID: teamID.required(),
});

const TeamAndUserSchema = Joi.object({
    userID: teamID.required(),
    teamID: teamID.required(),
}).options({ abortEarly: false });

module.exports = { TeamIDSchema, UserIDSchema, TeamAndUserSchema };