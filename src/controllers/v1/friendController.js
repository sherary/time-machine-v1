const { sequelize, friends } = require("../../databases/models");
const { responseHandler } = require("../../helpers/Commons");
const { httpCodes } = require("../../helpers/Constants");

const Friends = class {
    SendFriendRequest = async (req, res, next) => {
        const t = await sequelize.transaction();
        let result = {};

        try {
            const { userID } = req.body;
            const { friendID } = req.query;
            const friendRequest = {
                userID: userID,
                friendID: +friendID
            }
            const data = await friends.create(friendRequest);
            
            t.commit();
            result = responseHandler(httpCodes.CREATED.CODE, "Success creating new friendlist", data);
        } catch (err) {
            t.rollback();
            result = responseHandler(httpCodes.INTERNAL_ERROR.CODE, "Failed to create friend lists", err.message);
        }

        req.response = result;
        return next();
    }

    AcceptFriendRequest = async (req, res, next) => {
        let result = {};
        const t = await sequelize.transaction();
        try {
            const { userID } = req.body;
            const { friendID, accept } = req.query;
            
            const data = await friends.findOne({
                where: {
                    userID: userID,
                    friendID: +friendID
                },
                transaction: t
            })
            
            if (data) {
                const updateData = await friends.update({
                    status: +accept === 1 ? 'Accepted' : 'Pending'
                }, {
                    where: {
                        userID: userID,
                        friendID: +friendID
                    },
                    transaction: t
                })

                if (updateData == 0) {
                    t.rollback();
                    result = responseHandler(httpCodes.CONFLICT.CODE, "You are already connected");
                } else {
                    t.commit();
                    result = responseHandler(httpCodes.ACCEPTED.CODE, "Accepting friend request");
                }
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

    GetAllFriendRequests = async (req, res, next) => {
        let result = {};
        try {
            const { userID } = req.body;
            const data = await friends.findAll({
                where: {
                    userID: userID,
                    status: 'Pending'
                },
                raw: true
            })

            result = responseHandler(httpCodes.SUCCESS.CODE, "Success getting all friend requests", data);
        } catch (err) {
            result = responseHandler(httpCodes.INTERNAL_ERROR.CODE, "Failed to get all friend requests", err.message);
        }

        req.response = result;
        return next();
    }

    GetAllFriends = async (req, res, next) => {
        let result = {};
        try {
            const { userID } = req.body;
            const data = await friends.findAll({
                where: {
                    userID: userID,
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

    GetOne = async (req, res, next) => {
        let result = {};

        try {
            const data = await friends.findAll({
                where: {
                    userID: req.params.userID
                }
            });
            
            result = responseHandler(httpCodes.SUCCESS.CODE, "Success getting friends list", data);
        } catch (err) {
            result = responseHandler(httpCodes.INTERNAL_ERROR.CODE, "Failed to get friends list", err);
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
                    friendID: req.query.friendID
                },
                transaction: t
            })
            
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
}

module.exports = new Friends;