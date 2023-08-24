const Joi = require('joi');
const { PAYLOAD } = require('../../../helpers/Constants');

const friendID = Joi.number().integer().min(PAYLOAD.ID.MIN).max(PAYLOAD.ID.MAX)
const accept = Joi.number().integer().min(PAYLOAD.BOOLEAN.MIN).max(PAYLOAD.BOOLEAN.MAX)

const FriendIDSchema = Joi.object({
    friendID: friendID.required(),
})

const AcceptSchema = Joi.object({
    friendID: friendID.required(),
    accept: accept.required(),
}).options({ abortEarly: false });

module.exports = { FriendIDSchema, AcceptSchema };