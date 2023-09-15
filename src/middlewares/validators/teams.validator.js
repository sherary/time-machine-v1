const TeamsSchemas = require('./schemas/Teams');
const Validator = require('./index.validator');

const CreateTeamPayload = Validator.ValidateCreatePayload(TeamsSchemas.CreateSchema);
const IDPayload = Validator.ValidateIDParams(TeamsSchemas.IDSchema);
const UpdatePayload = Validator.ValidateUpdatePayload(TeamsSchemas.IDSchema, TeamsSchemas.UpdateSchema);

module.exports = { CreateTeamPayload, IDPayload, UpdatePayload };
