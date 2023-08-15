const UserSchemas = require('./schemas/Users');
const Validator = require('./index.validators');

const RegisterPayload = Validator.ValidateCreatePayload(UserSchemas.CreateSchema);
const IDPayload = Validator.ValidateIDParams(UserSchemas.IDSchema);
const UpdatePayload = Validator.ValidateUpdatePayload(UserSchemas.IDSchema, UserSchemas.UpdateSchema);

module.exports = { RegisterPayload, IDPayload, UpdatePayload };