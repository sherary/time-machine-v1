const { sequelize, teams, users, team_members } = require("../../databases/models");
const { responseHandler } = require("../../helpers/Commons");
const { httpCodes } = require("../../helpers/Constants");

const Teams = class {
    CreateTeam = async (req, res, next) => {
        let result = {};
        const t = await sequelize.transaction();
        try {
            const { creatorID, name, description } = req.body;
            const userData = { 
                creatorID: +creatorID, 
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
    GetAllTeams = async (req, res, next) => {
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

    GetOneTeam = async (req, res, next) => {
        let result = {};
        try {
            const { teamID } = req.params;
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

    // creator only
    InviteTeamMember = async (req, res, next) => {
        const t = await sequelize.transaction();
        let result = {};
        
        try {
            const { teamID, userID } = req.query;
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

    ViewAllRequests = async (req, res, next) => {
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

    //creator only
    MemberAcceptRequest = async (req, res, next) => {
        
    }

    JoinRequest = async (req, res, next) => {
        let result = {};
        const t = await sequelize.transaction();
        try {
            const { teamID, userID } = req.query;
            const data = await team_members.create({
                teamID: +teamID,
                userID: +userID
            }, {
                transaction: t
            })
            
            await t.commit();
            result = responseHandler(httpCodes.CREATED.CODE, "Success sending request", data);
        } catch (err) {
            await t.rollback();
            result = responseHandler(httpCodes.INTERNAL_ERROR.CODE, "Failed to create new request", err);
        }

        req.response = result;
        return next();
    }

    // creator only
    AcceptTeamMember = async (req, res, next) => {
        let result = {};
        const t = await sequelize.transaction();
        try {console.log(req.query)
            // const requestData = await teams.findOne({
            //     where: {
            //         id: +req.query.teamID
            //     },
            //     attributes: ['name', 'description', 'members_lists'],
            //     transaction: t,
            //     raw: true,
            // })
            // console.log(requestData);
        } catch (err) {
            console.log(err);
        }
    }

    // creator only
    RemoveTeamMember = async (req, res, next) => {
        const t = await sequelize.transaction();
        let result = {};
        
        try {
            const { teamID, userID } = req.query;
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
            console.log(data, user);
            // if (!user) {
            //     result = responseHandler(httpCodes.NOTFOUND.CODE, "No user found", user);
            // } else {
            //     if (data) {
            //         const members = JSON.parse(data['members_lists']);
            //         const members_lists = members.map(member => member.id);
            //         console.log(members_lists)
            //         // if (!members_lists.includes(+userID)) {
            //         //     result = responseHandler(httpCodes.CONFLICT.CODE, "Member has already left");
            //         // } else {
            //         //     members.push({ ...user, status: "Pending" });
            //         //     const newMember = JSON.stringify(members);
                        
            //         //     await teams.update({
            //         //         members_lists: newMember
            //         //     }, {
            //         //         where: {
            //         //             id: +req.query.teamID
            //         //         },
            //         //         transaction: t
            //         //     });
    
            //         //     await t.commit();
            //         //     result = responseHandler(httpCodes.ACCEPTED.CODE, "Success updating members", members);
            //         // }
            //     }
            // }
        } catch (err) {
            // await t.rollback();
            // result = responseHandler(httpCodes.INTERNAL_ERROR.CODE, "Failed to add team members", err);
        }

        // req.response = result;
        // return next();
    }

    //creator only
    BlockTeamMember = async (req, res, next) => {
        try {
            
        } catch (err) {
            
        }
    }

    // creator only
    DisbandTeam = async (req, res, next) => {
        try {
            
        } catch (err) {
            
        }
    }
}

module.exports = new Teams;