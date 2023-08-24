const FriendsSchemas = require('./schemas/Friends');
const Validator = require('./index.validator');
const { httpCodes } = require('../../helpers/Constants');
const ParsedError = require('../Error');
const { getAvailableColumn } = require('../../helpers/Commons');
const { users } = require('../../databases/models');
const Error = new ParsedError();

const SendRequestPayload = Validator.ValidateFriendRequest(FriendsSchemas.FriendIDSchema);
const ConfirmConnectionPayload = Validator.ValidateFriendConfirmation(FriendsSchemas.AcceptSchema);
const IDPayload = Validator.ValidateIDParams(FriendsSchemas.FriendIDSchema);
const ClusterIDPayload = Validator.ValidateIDParams(FriendsSchemas.ClusterIDSchema);

const CheckIDAvailability = async (userID, friendID) => {
    try {
        const availableUsers = await getAvailableColumn(users, ['id']);
        const data = availableUsers.map(item => item.id);
        return data.includes(userID) && data.includes(friendID);
    } catch (err) {
        return err
    }
}

const CheckIDMatch = () => {
    return async (req, res, next) => {
        const { id } = req.user;
        const { friendID } = req.data;
        const data = await CheckIDAvailability(id, friendID);
        
        if (!data) {
            return res.status(httpCodes.BAD_REQUEST.CODE).json(Error.BadRequest("ID not available"));
        }

        if (id == friendID) {
            return res.status(httpCodes.BAD_REQUEST.CODE).json(Error.BadRequest("You cannot do that to yourself :<"));
        }

        return next();
    }
}

module.exports = { SendRequestPayload, ConfirmConnectionPayload, IDPayload, ClusterIDPayload, CheckIDMatch };