const FriendsSchemas = require('./schemas/Friends');
const Validator = require('./index.validator');

const SendRequestPayload = Validator.ValidateFriendRequest(FriendsSchemas.FriendIDSchema);
const ConfirmConnectionPayload = Validator.ValidateFriendConfirmation(FriendsSchemas.AcceptSchema);
const IDPayload = Validator.ValidateIDParams(FriendsSchemas.FriendIDSchema);

module.exports = { SendRequestPayload, ConfirmConnectionPayload, IDPayload };