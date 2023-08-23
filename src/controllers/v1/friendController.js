const { sequelize, friendslists } = require("../../databases/models");
const { responseHandler } = require("../../helpers/Commons");
const { httpCodes } = require("../../helpers/Constants");

const Friends = class {
    Create = async (req, res, next) => {
        const t = await sequelize.transaction();
        let result = {};

        try {
            const data = await friendslists.create(req.body);
            
            t.commit();
            result = responseHandler(httpCodes.CREATED.CODE, "Success creating new friendlist", data);
        } catch (err) {
            t.rollback();
            result = responseHandler(httpCodes.INTERNAL_ERROR.CODE, "Failed to create friend lists", err.message);
        }

        req.response = result;
        return next();
    }

    GetAll = async (req, res, next) => {
        let result = {};
        try {
            const data = await friendslists.findAll();
            
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
            const data = await friendslists.findAll({
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

    Update = async (req, res, next) => {
        const t = await sequelize.transaction();
        let result = {};

        try {
            const data = await friendslists.update(req.body, {
                where: {
                    userID: req.params.userID
                },
                transaction: t
            });
            
            t.commit();
            result = responseHandler(httpCodes.ACCEPTED.CODE, "Success updating friends list", data);
        } catch (err) {
            t.rollback();
            result = responseHandler(httpCodes.INTERNAL_ERROR.CODE, "Failed to update friends list", err);
        }

        req.response = result;
        return next();
    }

    Delete = async (req, res, next) => {
        const t = await sequelize.transaction();
        let result = {};

        try {
            const data = await friendslists.destroy({
                where: {
                    userID: req.params.userID
                },
                transaction: t
            })
            
            t.commit();
            result = responseHandler(httpCodes.ACCEPTED.CODE, "Success deleting friend list", data);
        } catch (err) {
            t.rollback();
            result = responseHandler(httpCodes.INTERNAL_ERROR.CODE, "Failed to delete friend lists", err);
        }

        req.response = result;
        return next();
    }
}

module.exports = new Friends;