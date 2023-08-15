const { sequelize, users, device_management } = require('../../databases/models/index');
const ParsedSuccess = require('../../middlewares/Success');
const ParsedError = require('../../middlewares/Error');
const Error = new ParsedError();
const Success = new ParsedSuccess();
const { httpCodes } = require('../../helpers/Constants');
const userAgent = require('useragent');

const Users = class {
    Register = async (req, res) => {
        const t = await sequelize.transaction();
        try {
            const data = await users.create(req.data, { transaction: t });
            
            if (data) {
                await t.commit();
                return res.status(httpCodes.CREATED.CODE).json(Success.Created("Success creating new account",  data));
            }
        } catch (err) {
            await t.rollback();
            res.status(httpCodes.INTERNAL_ERROR.CODE).json(Error.InternalError("Failed to create new account", err));
        }
    }

    Login = async (req, res) => {
        const t = await sequelize.transaction();
        try {
            const { user_id, location } = req.body;
            const updateData = { user_id, location };
            const agent = req.headers['user-agent']
            updateData['agent'] = agent;
            updateData['last_login'] = new Date();
            updateData['isLoggedIn'] = 1;
            updateData['OS'] = userAgent.parse(agent.os).os.family;
            
            let data;
            
            const deviceManagement = await device_management.findOne({
                where: {
                    userID: user_id
                },
                raw: true
            });
    
            if (!deviceManagement) {
                data = await device_management.create({
                    userID: user_id,
                    ...updateData
                }, { transaction: t });
            } else {
                data = await device_management.update(updateData, {
                    where: {
                        userID: user_id
                    },
                    transaction: t
                });
            }
    
            await t.commit();
            return res.status(httpCodes.CREATED.CODE).json(Success.Created("Success create new device management", data));
        } catch (err) {
            await t.rollback();
            return res.status(httpCodes.INTERNAL_ERROR.CODE).json(Error.InternalError("Failed to create new device management", err.message));
        }
    }    

    Logout = async (req, res) => {
        try {
            const data = await device_management.update({ isLoggedIn: false }, {
                where: {
                    userID: req.body.user_id
                }
            })

            if (data == 1) {
                return req.logout((err) => {
                    if (!err) {
                        req.session.destroy()
                        return res.status(httpCodes.ACCEPTED.CODE).json(Success.Accepted("Success logging out"));
                    }
                })
            }

            return res.status(httpCodes.CONFLICT.CODE).json(Error.Conflict("You are already logged out"));
        } catch (err) {
            console.log(err)
            return res.status(httpCodes.INTERNAL_ERROR.CODE).json(Error.InternalError("Failed to log out", err));
        }
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
                    id: req.data.user_id
                }
            }, { raw: true });

            return res.status(httpCodes.SUCCESS.CODE).json(Success.OK("Success getting all users", data));
        } catch (err) {
            return res.status(httpCodes.INTERNAL_ERROR.CODE).json(Error.InternalError("Failed to getting all user", err.message));
        }
    }

    UpdateUser = async (req, res) => {
        const t = await sequelize.transaction();
        try {
            const { user_id, name, dob, username, email } = req.data;
            const updatedData = { user_id, name, dob, username, email };
            const data = await users.update(updatedData, {
                where: {
                    id: user_id
                },
                transaction: t
            });
            
            if (data == 1) {
                t.commit();
                return res.status(httpCodes.ACCEPTED.CODE).json(Success.Accepted("Success updating users", req.body));
            }

            return res.status(httpCodes.NOTFOUND.CODE).json(Error.NotFound("No row updated"));
        } catch (err) {
            t.rollback();
            return res.status(httpCodes.INTERNAL_ERROR.CODE).json(Error.InternalError("Failed to updating user", err.message));
        }
    }

    DeleteUser = async (req, res) => {
        const t = await sequelize.transaction();
        try {
            const { user_id } = req.data;
            const data = await users.destroy({
                where: {
                    id: user_id
                },
                transaction: t
            });

            if (data == 1) {
                t.commit();
                return res.status(httpCodes.ACCEPTED.CODE).json(Success.Accepted("Success deleting users"));
            }

            return res.status(httpCodes.NOTFOUND.CODE).json(Error.NotFound("No row deleted"));
        } catch (err) {
            t.rollback();
            return res.status(httpCodes.INTERNAL_ERROR.CODE).json(Error.InternalError("Failed to delete user", err.message));
        }
    }
}

module.exports = new Users;