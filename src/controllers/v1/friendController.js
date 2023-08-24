const { sequelize, friends, Sequelize } = require("../../databases/models");
const { responseHandler } = require("../../helpers/Commons");
const { httpCodes } = require("../../helpers/Constants");

const Friends = class {
    SendFriendRequest = async (req, _, next) => {
        const t = await sequelize.transaction();
        let result = {};

        try {
            const { id } = req.user;
            const { friendID } = req.data;
            const friendRequest = {
                userID: +id,
                friendID: +friendID
            }
            const data = await friends.create(friendRequest, {
                transaction: t
            });
            
            t.commit();
            result = responseHandler(httpCodes.CREATED.CODE, "Success creating new friendlist", data);
        } catch (err) {
            t.rollback();
            result = responseHandler(httpCodes.INTERNAL_ERROR.CODE, "Failed to create friend lists", err.message);
        }

        req.response = result;
        return next();
    }

    AcceptFriendRequest = async (req, _, next) => {
        let result = {};
        const t = await sequelize.transaction();
        try {
            const { id } = req.user;
            const { friendID, accept } = req.data;
            
            const data = await friends.findOne({
                where: {
                    userID: +id,
                    friendID: +friendID
                },
                transaction: t
            })
            
            if (data) {
                const updateData = await friends.update({
                    status: +accept === 1 ? 'Accepted' : 'Pending'
                }, {
                    where: {
                        userID: id,
                        friendID: +friendID
                    },
                    transaction: t
                })

                t.commit();
                result = responseHandler(httpCodes.ACCEPTED.CODE, "Accepting friend request", updateData);
            } else {
                t.rollback();
                result = responseHandler(httpCodes.NOTFOUND.CODE, "No friend request found");
            }
        } catch (err) {
            t.rollback();
            result = responseHandler(httpCodes.INTERNAL_ERROR.CODE, "Failed to update friend request status", err);
        }

        req.response = result;
        return next();
    }

    GetAllFriendRequests = async (req, _, next) => {
        let result = {};
        try {
            const { id } = req.user;
            const data = await friends.findAll({
                where: {
                    userID: +id,
                    status: 'Pending'
                },
                raw: true
            })
            
            if (data.length == 0) {
                result = responseHandler(httpCodes.SUCCESS.CODE, "You have no friend request", data);
            } else {
                result = responseHandler(httpCodes.SUCCESS.CODE, "Success getting all friend requests", data);
            }
        } catch (err) {
            result = responseHandler(httpCodes.INTERNAL_ERROR.CODE, "Failed to get all friend requests", err.message);
        }

        req.response = result;
        return next();
    }

    GetAllFriends = async (req, _, next) => {
        let result = {};
        try {
            const { id } = req.user;
            const data = await friends.findAll({
                where: {
                    userID: +id,
                    status: 'Accepted'
                }
            });
            
            result = responseHandler(httpCodes.SUCCESS.CODE, "Success getting all friendlist", data);
        } catch (err) {
            result = responseHandler(httpCodes.INTERNAL_ERROR.CODE, "Failed to get all friendlists", err);
        }

        req.response = result;
        return next();
    }

    Delete = async (req, res, next) => {
        const t = await sequelize.transaction();
        let result = {};

        try {
            const data = await friends.destroy({
                where: {
                    friendID: req.data.friendID
                },
                transaction: t
            });
            
            if (data) {
                t.commit();
                result = responseHandler(httpCodes.ACCEPTED.CODE, "Success deleting friend list");
            } else {
                result = responseHandler(httpCodes.CONFLICT.CODE, "No connection with this user");
            }
        } catch (err) {
            t.rollback();
            result = responseHandler(httpCodes.INTERNAL_ERROR.CODE, "Failed to delete friend lists", err);
        }

        req.response = result;
        return next();
    }

    DeleteByClusterID = async (req, _, next) => {
        const t = await sequelize.transaction();
        let result = {};

        try {
            const data = await friends.destroy({
                where: {
                    friendID: req.data.clusterID
                },
                transaction: t
            });
            
            t.commit();
            result = responseHandler(httpCodes.ACCEPTED.CODE, "Success deleting friend", data);
        } catch (err) {
            t.rollback();
            result = responseHandler(httpCodes.INTERNAL_ERROR.CODE, "Failed to delete friend", err);
        }

        req.response = result;
        return next();
    }

    BulkDelete = async (req, _, next) => {
        const t = await sequelize.transaction();
        let result = {};
        
        try {
            const duplicates = await friends.findAll({
                attributes: ['userID', 'friendID'],
                group: ['userID', 'friendID'],
                having: Sequelize.literal('COUNT(*) > 1'),
                raw: true,
                transaction: t
            })

            duplicates.map(async items => {
                await friends.destroy({
                    where: items
                })
            })

            t.commit();
            result = responseHandler(httpCodes.ACCEPTED.CODE, "Bulk Delete in progress");
        } catch (err) {
            t.rollback();
            result = responseHandler(httpCodes.INTERNAL_ERROR.CODE, "Failed to bulk delete");
        }

        req.response = result;
        return next();
    }
}

module.exports = new Friends;