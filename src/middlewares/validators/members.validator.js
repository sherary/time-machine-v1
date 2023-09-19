const MemberSchemas = require('./schemas/Members');
const Validator = require('./index.validator');
const { teams } = require('../../databases/models');
const { httpCodes } = require('../../helpers/Constants');
const { responseHandler } = require('../../helpers/Commons');

const IDPayload = Validator.ValidateIDParams(MemberSchemas.TeamIDSchema);
const TeamAndUserSchema = Validator.ValidateIDParams(MemberSchemas.TeamAndUserSchema);

const teamInfo = async (id) => {
    try {
        const data = await teams.findOne({
            where: {
                id: id
            },
            raw: true
        })
        
        return data
    } catch (err) {
        return err.message
    }
}

const checkPrivilege = () => {
    return async (req, _, next) => {
        try {
            const team = await teamInfo(req.data.teamID);

            if (team.creatorID == req.user.id) {
                req.teamData = team;
                return next();
            }
            
            return responseHandler(httpCodes.FORBIDDEN.CODE, "Not a creator, cannot do this");
        } catch (err) {
            return responseHandler(httpCodes.INTERNAL_ERROR.CODE, "Failed to display whatever it is");
        }
    }
}

module.exports = { IDPayload, TeamAndUserSchema, checkPrivilege };