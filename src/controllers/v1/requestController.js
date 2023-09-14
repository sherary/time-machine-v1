const { sequelize, users, teams, friends, team_members } = require("../../databases/models");
const { responseHandler } = require("../../helpers/Commons");
const { httpCodes } = require("../../helpers/Constants");

const Requests = class {
    getAllRequests = async (req, res, next) => {
        let result = {};
        try {
            const friendRequests = await friends.findAll({
                where: {
                    userID: +req.body.userID,
                    status: 'Pending'
                },
                attributes: ['friendID', 'capsule_total', 'status'],
                raw: true
            });

            const teamRequests = await team_members.findAll({
                where: {
                    userID: +req.body.userID,
                    status: 'Pending',
                },
                attributes: ['teamID', 'status', 'contributions'],
                raw: true
            });
            
            result = responseHandler(httpCodes.ACCEPTED.CODE, "Success getting all requests", { 
                teams: teamRequests.length == 0 ? 0 : teamRequests, 
                friends: friendRequests.length == 0 ? 0 : friendRequests 
            });
        } catch (error) {
            result = responseHandler(httpCodes.INTERNAL_ERROR.CODE, "Failed to get all request", error.message);
        }

        req.response = result;
        return next();
    }

    getAllFriendRequests = async (req, res, next) => {
        let result = {}
        try {
            const data = await friends.findAll({
                where: {
                    userID: +req.body.userID,
                    status: 'Pending'
                },
                attributes: ['friendID', 'status', 'capsule_total'],
                raw: true
            });
            
            result = responseHandler(httpCodes.SUCCESS.CODE, "Success getting all pending friend requests", data);
        } catch (error) {
            result = responseHandler(httpCodes.INTERNAL_ERROR.CODE, "Failed to get all friend requests", error.message);
        }

        req.response = result;
        return next();
    }

    getAllTeamRequests = async (req, res, next) => {
        let result = {}
        try {
            const data = await team_members.findAll({
                where: {
                    userID: +req.body.userID,
                    status: 'Pending'
                },
                attributes: ['teamID', 'status'],
                include: {
                    model: teams,
                    as: 'teams_members',
                    attributes: ['name']
                },
                raw: true
            });
            data.map(items => {
                items['group_name'] = items['teams_members.name']
                delete items['teams_members.name']

                return items;
            })
            
            result = responseHandler(httpCodes.SUCCESS.CODE, "Success getting all pending friend requests", data);
        } catch (error) {
            result = responseHandler(httpCodes.INTERNAL_ERROR.CODE, "Failed to get all friend requests", error.message);
        }

        req.response = result;
        return next();
    }

    acceptFriendRequest = async (req, res, next) => {
        let result = {}
        const t = await sequelize.transaction();
        try {
            const data = await friends.update({
                status: 'Accepted'
            }, {
                where: { 
                    friendID: +req.query.friendID,
                    userID: +req.body.userID,
                    status: 'Pending'
                },
                raw: true,
                transaction: t
            })

            if (data < 1) {
                await t.rollback();
                result = responseHandler(httpCodes.NOTFOUND.CODE, "Friend request not found", data);
            } else {
                await t.commit();
                result = responseHandler(httpCodes.ACCEPTED.CODE, "Friend request accepted", data);
            }
        } catch (error) {
            await t.rollback();
            result = responseHandler(httpCodes.INTERNAL_ERROR.CODE, "Failed to accept friend request", error.message);
        }

        req.response = result;
        return next();
    }

    acceptTeamRequest = async (req, res, next) => {
        let result = {}
        const t = await sequelize.transaction();
        try {
            const data = await team_members.update({
                status: 'Accepted'
            }, {
                where: { 
                    teamID: +req.query.teamID,
                    userID: +req.body.userID,
                    status: 'Pending'
                },
                raw: true,
                transaction: t
            })

            if (data < 1) {
                await t.rollback();
                result = responseHandler(httpCodes.NOTFOUND.CODE, "Team request not found", data);
            } else {
                await t.commit();
                result = responseHandler(httpCodes.ACCEPTED.CODE, "Team request accepted", data);
            }
        } catch (error) {
            await t.rollback();
            result = responseHandler(httpCodes.INTERNAL_ERROR.CODE, "Failed to accept team request", error.message);
        }

        req.response = result;
        return next();
    }

    sendFriendRequest = async (req, res, next) => {
        let result = {}
        const t = await sequelize.transaction();

        try {
            const data = await friends.create({
                userID: +req.body.userID,
                friendID: +req.body.friendID
            }, {
                transaction: t
            });

            await t.commit();
            result = responseHandler(httpCodes.CREATED.CODE, "Friend request sent!", data);
        } catch (error) {
            await t.rollback();
            result = responseHandler(httpCodes.INTERNAL_ERROR.CODE, "Faild to send friend request", error.message);
        }

        req.response = result;
        return next();
    }

    sendTeamRequest = async (req, res, next) => {
        let result = {}
        const t = await sequelize.transaction();

        try {
            const data = await team_members.create({
                userID: +req.body.userID,
                teamID: +req.body.teamID
            }, {
                transaction: t
            });

            await t.commit();
            result = responseHandler(httpCodes.CREATED.CODE, "Team request sent!", data);
        } catch (error) {
            await t.rollback();
            result = responseHandler(httpCodes.INTERNAL_ERROR.CODE, "Faild to send team request", error.message);
        }

        req.response = result;
        return next();
    }
}

module.exports = new Requests;