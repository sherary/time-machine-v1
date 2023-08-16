const { sequelize, users, device_management } = require('../../databases/models/index');
const ParsedSuccess = require('../../middlewares/Success');
const ParsedError = require('../../middlewares/Error');
const Error = new ParsedError();
const Success = new ParsedSuccess();
const { httpCodes } = require('../../helpers/Constants');
const userAgent = require('useragent');
const { encrypt, generateToken } = require('../../helpers/Commons');

const Users = class {
    Register = async (req, res) => {
        const t = await sequelize.transaction();
        try {
            const { username, email, password } = req.data;
            const encryptedPassword = encrypt(password);
            
            const data = await users.create({
                username: username,
                email: email,
                password: encryptedPassword
            }, 
                { transaction: t });
            
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
            const { id } = req.user;
            const updateData = {};
            const agent = req.headers['user-agent']
            updateData['agent'] = agent;
            updateData['last_login'] = new Date();
            updateData['isLoggedIn'] = 1;
            updateData['OS'] = userAgent.parse(agent.os).os.family;
            
            let data;
            
            const deviceManagement = await device_management.findOne({
                where: {
                    userID: id
                },
                include: {
                    model: users,
                    as: 'users',
                    attributes: ['role']
                },
                attributes: ['userID', 'agent', 'OS', 'location', 'last_login', 'isLoggedIn'],
                raw: true,
                nested: true
            });
            
            if (!deviceManagement) {
                data = await device_management.create({
                    userID: id,
                    ...updateData
                }, { transaction: t });
            } else {
                data = await device_management.update(updateData, {
                    where: {
                        userID: id
                    },
                    transaction: t
                });
                
            }
            
            await t.commit();

            delete req.user['password'];
            delete req.user['createdAt'];
            delete req.user['updatedAt'];
            
            data = generateToken(req.user);

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
                    userID: req.data.userID
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
                    id: req.user.id
                }
            }, { raw: true });

            if(data) {
                return res.status(httpCodes.SUCCESS.CODE).json(Success.OK("Success getting all users", data));
            }

            return res.status(httpCodes.NOTFOUND.CODE).json(Error.NotFound("No user found"));
        } catch (err) {
            return res.status(httpCodes.INTERNAL_ERROR.CODE).json(Error.InternalError("Failed to getting all user", err.message));
        }
    }

    UpdateUser = async (req, res) => {
        const t = await sequelize.transaction();
        try {
            const { name, dob, username, email } = req.data;
            const { id } = req.user;
            const updatedData = { id, name, dob, username, email };
            const data = await users.update(updatedData, {
                where: {
                    id: id
                },
                transaction: t
            });
            console.log(updatedData, req.user)
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