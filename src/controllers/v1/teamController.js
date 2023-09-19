const { sequelize, teams, users, team_members } = require("../../databases/models");
const { responseHandler } = require("../../helpers/Commons");
const { httpCodes } = require("../../helpers/Constants");

const Teams = class {
    CreateTeam = async (req, _, next) => {
        let result = {};
        const t = await sequelize.transaction();
        try {
            const { name, description } = req.data;
            const userData = { 
                creatorID: +req.user.id, 
                name: name, 
                description: description 
            } 
            const data = await teams.create(userData, {
                transaction: t,
            });

            await team_members.create({
                teamID: data.id,
                userID: data.creatorID
            }, {
                transaction: t
            });
            
            if (data) {
                await t.commit();
                result = responseHandler(httpCodes.CREATED.CODE, "Success creating new team", data);
            }
        } catch (err) {console.log(err)
            await t.rollback();
            result = responseHandler(httpCodes.INTERNAL_ERROR.CODE, "Failed to create new team", err);
        }

        req.response = result;
        return next();
    }

    //dev only
    GetAllTeams = async (req, _, next) => {
        let result = {};
        try {
            const data = await teams.findAll({
                include: {
                    model: team_members,
                    as: 'members',
                    attributes: ['userID', 'status', 'contributions']
                },
                nest: true
            });
            
            if (data) {
                result = responseHandler(httpCodes.SUCCESS.CODE, "Success getting all teams", data);
            }
        } catch (err) {
            result = responseHandler(httpCodes.INTERNAL_ERROR.CODE, "Failed to get all teams", err);
        }

        req.response = result;
        return next();
    }

    GetOneTeam = async (req, _, next) => {
        let result = {};
        try {
            const { teamID } = req.data;
            const data = await teams.findAll({
                where: {
                    id: +teamID
                },
                attributes: ['id', 'creatorID', 'name', 'description'],
                include: {
                    model: team_members,
                    as: 'members',
                    attributes: ['userID', 'status', 'contributions'],
                    include: [
                        {
                            model: users,
                            as: 'team_members',
                            attributes: ['name']
                        }
                    ]
                },
            });

            if (data) {
                result = responseHandler(httpCodes.SUCCESS.CODE, "Success getting team", data);
            }
        } catch (err) {
            result = responseHandler(httpCodes.INTERNAL_ERROR.CODE, "Failed to get team", err);
        }

        req.response = result;
        return next();
    }

    ViewAllTeamMembers = async (req, _, next) => {
        let result = {};
        try {
            const data = await team_members.findAll({
                where: {
                    teamID: req.data.teamID,
                    status: 'Accepted'
                },
                raw: true
            });

            if (data) {
                result = responseHandler(httpCodes.SUCCESS.CODE, "View all team member success!", data);
            } else {
                result = responseHandler(httpCodes.NOTFOUND.CODE, "No team members found", data);
            }
        } catch (error) {
            result = responseHandler(httpCodes.INTERNAL_ERROR.CODE, "Failed to view all team members", error.message);
        }

        req.response = result;
        return next();
    }

    // creator only
    InviteTeamMember = async (req, _, next) => {
        const t = await sequelize.transaction();
        let result = {};
        
        try {
            const { teamID, userID } = req.data;
            const data = await teams.findOne({
                where: {
                    id: +teamID
                },
                transaction: t,
                raw: true
            })

            const user = await users.findOne({
                where: {
                    id: +userID
                },
                transaction: t,
                attributes: ['id', 'name'],
                raw: true
            });

            if (!user) {
                result = responseHandler(httpCodes.NOTFOUND.CODE, "No user found", user);
            } else {
                if (data) {
                    const invite = await team_members.create({
                        teamID: data.id,
                        userID: user.id,
                    })
                    await t.commit();
                    result = responseHandler(httpCodes.CREATED.CODE, `User ${user.name} invited successfully`, invite);
                } else {
                    await t.rollback();
                    result = responseHandler(httpCodes.NOTFOUND.CODE, "No team found, either got deleted or wrong credentials :)");
                }
            }
        } catch (err) {
            await t.rollback();
            result = responseHandler(httpCodes.INTERNAL_ERROR.CODE, "Failed to add team members", err);
        }

        req.response = result;
        return next();
    }

    ViewAllRequests = async (req, _, next) => {
        let result = {};
        try {
            const { teamID } = req.query;
            const data = await team_members.findAll({
                where: {
                    teamID: +teamID,
                    status: 'Pending'
                }
            })

            if (data) {
                result = responseHandler(httpCodes.SUCCESS.CODE, "Success getting all join requests", data);
            } else {
                result = responseHandler(httpCodes.NOTFOUND.CODE, "Join request is empty", data);
            }
        } catch (err) {
            result = responseHandler (httpCodes.INTERNAL_ERROR.CODE, "Failed to get all join requests", err.message);
        }

        req.response = result
        return next();
    }
    
    // creator only
    RemoveTeamMember = async (req, _, next) => {
        const t = await sequelize.transaction();
        let result = {};
        
        try {
            const { teamID, userID } = req.data;
            
            const data = await team_members.destroy({
                where: {
                    userID: +userID,
                    teamID: +teamID,
                },
                transaction: t,
            })
            
            if (data) {
                await t.commit();
                result = responseHandler(httpCodes.ACCEPTED.CODE, "Success removing team member", data);
            } else {
                await t.rollback();
                result = responseHandler(httpCodes.NOTFOUND.CODE, "No member found", data);
            }
        } catch (err) {
            await t.rollback();
            result = responseHandler(httpCodes.INTERNAL_ERROR.CODE, "Failed to remove team members", err.message);
        }

        req.response = result;
        return next();
    }

    //creator only
    BlockTeamMember = async (req, _, next) => {
        let result = {}
        const t = await sequelize.transaction();

        try {
            const { userID, teamID } = req.query;
            const data = await team_members.update({
                status: 'Blocked'
            }, {
                where: {
                    userID: +userID,
                    teamID: +teamID,
                    status: 'Accepted'
                },
                transaction: t
            })    
            
            if (data > 0) {
                await t.commit();
                result = responseHandler(httpCodes.ACCEPTED.CODE, "Success blocking member", data);
            } else {
                await t.rollback();
                result = responseHandler(httpCodes.NOTFOUND.CODE, "Member not found", data);
            }
        } catch (err) {
            await t.rollback();
            result = responseHandler(httpCodes.INTERNAL_ERROR.CODE, "Failed to block member", err.message);
        }

        req.response = result;
        return next();
    }

    ViewAllBlockedMembers = async (req, _, next) => {
        let result = {}
        try {
            const data = await team_members.findAll({
                where: {
                    teamID: +req.data.teamID,
                    status: 'Blocked'
                },
                include: {
                    model: users,
                    as: 'team_members',
                    attributes: ['name']
                },
                raw: true
            });

            let newObj = {}
            data.map(items => {
                newObj['name'] = items['team_members.name'];
                delete items['team_members.name'];
                items['name'] = newObj['name'];
            })
            
            if (data) {
                result = responseHandler(httpCodes.SUCCESS.CODE, "Success getting all blcoked members", data);
            } else {
                result = responseHandler(httpCodes.NOTFOUND.CODE, "No blocked members found", data);
            }
        } catch (err) {
            result = responseHandler(httpCodes.INTERNAL_ERROR.CODE, "Failed to get all blocked members", err.message);
        }

        req.response = result;
        return next();
    }

    // creator only
    EditTeam = async (req, _, next) => {
        let result = {}
        const t = await sequelize.transaction();

        try {
            const { name, description } = req.data;
            const data = await teams.update({
                name: name,
                description: description
            }, {
                where: {
                    id: +req.params.teamID,
                    creatorID: +req.user.id
                },
                transaction: t,
            })
            
            if (data > 0) {
                await t.commit();
                result = responseHandler(httpCodes.ACCEPTED.CODE, "Success updating team info!",  data);
            } else {
                await t.rollback();
                result = responseHandler(httpCodes.NOTFOUND.CODE, "No changes made", data);
            }
        } catch (err) {
            await t.rollback();
            result = responseHandler(httpCodes.INTERNAL_ERROR.CODE, "Failed to update team info", err.message);
        }

        req.response = result;
        return next();
    }

    // creator only
    DisbandTeam = async (req, _, next) => {
        const t = await sequelize.transaction();
        let result = {};
        try {
            const data = await teams.destroy({
                where: {
                    id: +req.data.teamID,
                    creatorID: +req.user.id
                },
                transaction: t,
            });

            if (data > 0) {
                await t.commit();
                result = responseHandler(httpCodes.ACCEPTED.CODE, "Disband team success!", data);
            } else {
                await t.rollback();
                result = responseHandler(httpCodes.NOTFOUND.CODE, "Team not found!", data);
            }
        } catch (err) {
            await t.rollback();
            result = responseHandler(httpCodes.INTERNAL_ERROR.CODE, "Failed to disband team", err.message);
        }

        req.response = result;
        return next();
    }
}

module.exports = new Teams;