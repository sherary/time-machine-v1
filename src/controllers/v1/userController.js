const db = require('../../databases/models/index');
const ParsedSuccess = require('../../middlewares/Success');
const ParsedError = require('../../middlewares/Error');
const Error = new ParsedError();
const Success = new ParsedSuccess();
const { httpCodes } = require('../../helpers/Constants');
const { users } = db;

const Users = class {
    Register = async (req, res) => {
        try { 
            const data = await users.create(req.body, { raw: true });
            
            return res.status(httpCodes.CREATED.CODE).json(Success.Created("Success creating new user", data))
        } catch (err) {
            return res.status(httpCodes.INTERNAL_ERROR.CODE).json(Error.InternalError("Failed to create new user", err.message));
        }
    }

    Login = async (req, res) => {

    }

    Logout = async (req, res) => {

    }

    GetAllUsers = async (req, res) => {
        try {
            const data = await users.findAll({ raw: true });

            return res.status(httpCodes.SUCCESS.CODE).json(Success.OK("Success getting all users", data));
        } catch (err) {
            return res.status(httpCodes.INTERNAL_ERROR.CODE).json(Error.InternalError("Failed to getting all user", err.message));
        }
    }

    GetOneUser = async (req, res) => {
        try {
            const data = await users.findOne({
                where: {
                    id: req.params.user_id
                }
            }, { raw: true });

            return res.status(httpCodes.SUCCESS.CODE).json(Success.OK("Success getting all users", data));
        } catch (err) {
            return res.status(httpCodes.INTERNAL_ERROR.CODE).json(Error.InternalError("Failed to getting all user", err.message));
        }
    }

    UpdateUser = async (req, res) => {
        try {
            const data = await users.update(req.body, {
                where: {
                    id: req.params.user_id
                },
            });

            if (data == 1) {
                return res.status(httpCodes.ACCEPTED.CODE).json(Success.Accepted("Success updating users", req.body));
            }

            return res.status(httpCodes.NOTFOUND.CODE).json(Error.NotFound("No row updated"));
        } catch (err) {
            return res.status(httpCodes.INTERNAL_ERROR.CODE).json(Error.InternalError("Failed to updating user", err.message));
        }
    }

    DeleteUser = async (req, res) => {
        try {
            const data = await users.destroy({
                where: {
                    id: req.params.user_id
                }
            });

            if (data == 1) {
                return res.status(httpCodes.ACCEPTED.CODE).json(Success.Accepted("Success deleting users"));
            }

            return res.status(httpCodes.NOTFOUND.CODE).json(Error.NotFound("No row deleted"));
        } catch (err) {
            return res.status(httpCodes.INTERNAL_ERROR.CODE).json(Error.InternalError("Failed to delete user", err.message));
        }
    }
}

module.exports = new Users;