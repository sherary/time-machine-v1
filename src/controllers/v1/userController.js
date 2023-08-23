const { sequelize, users, device_management, friendslists } = require('../../databases/models/index');
const { httpCodes } = require('../../helpers/Constants');
const userAgent = require('useragent');
const { encrypt, generateToken, responseHandler } = require('../../helpers/Commons');

const Users = class {
    Register = async (req, _, next) => {
        const t = await sequelize.transaction();
        let response = {};

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
                const cluster = await friendslists.create({
                    userID: data.id,
                }, { transaction: t });
                
                await t.commit();
                response = responseHandler(httpCodes.CREATED.CODE, "Success creating new account", [data, cluster]);
                req.response = response;
                return next();
            }
        } catch (err) {console.log(err)
            await t.rollback();
            response = responseHandler(httpCodes.INTERNAL_ERROR.CODE, "Failed to create new account", err);
            req.response = response;
            return next();
        }
    }

    Login = async (req, _, next) => {
        const t = await sequelize.transaction();
        let response = {};
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
            response = responseHandler(httpCodes.CREATED.CODE, "Success creating new device management", data);
            req.response = response;
            next();
        } catch (err) {
            await t.rollback();
            response = responseHandler(httpCodes.INTERNAL_ERROR.CODE, "Failed to create new device management", err);
            req.response = response;
            return next();
        }
    }    

    Logout = async (req, _, next) => {console.log("User", req.user)
        let response = {};
        try {
            const data = await device_management.update({ isLoggedIn: false }, {
                where: {
                    userID: req.user.id
                }
            })

            if (data == 1) {
                return req.logout((err) => {
                    if (!err) {
                        req.session.destroy()
                        response = responseHandler(httpCodes.ACCEPTED.CODE, "Success logging out");
                        req.response = response;
                        
                        return next();
                    }
                })
            }

            response = responseHandler(httpCodes.CONFLICT.CODE, "You are already logged out");
            req.response = response;

            return next();
        } catch (err) {console.log(err)
            response = responseHandler(httpCodes.INTERNAL_ERROR.CODE, "Failed to log out", err)
            req.response = response;

            return next();
        }
    }

    GetAllUsers = async (req, _, next) => {
        let response = {};
        try {
            const data = await users.findAll({ raw: true });

            data.map(items => {
                delete items['password']
                
                return items
            })

            response = responseHandler(httpCodes.SUCCESS.CODE, "Success getting all users", data);
            req.response = response;

            return next();
        } catch (err) {
            response = responseHandler(httpCodes.INTERNAL_ERROR.CODE, "Failed getting all user", err);
            req.response = response;
            
            return next();
        }
    }

    GetOneUser = async (req, _, next) => {
        let response = {};
        try {
            const data = await users.findOne({
                where: {
                    id: req.data.user_id
                }
            }, { raw: true });

            if(data) {
                response = responseHandler(httpCodes.SUCCESS.CODE, "Success getting user", data);
                req.response = response;

                return next();
            }

            response = responseHandler(httpCodes.NOTFOUND.CODE, "No user found");
            req.response = response;
            
            return next();
        } catch (err) {
            response = responseHandler(httpCodes.INTERNAL_ERROR.CODE, "Failed to getting all user", err);
            req.response = response;

            return next();
        }
    }

    UpdateUser = async (req, _, next) => {
        const t = await sequelize.transaction();
        let response = {};
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
            
            if (data == 1) {
                await t.commit();
                response = responseHandler(httpCodes.ACCEPTED.CODE, 'Successfully Updated', req.data);
                req.response = response;

                return next();
            }

            response = responseHandler(httpCodes.NOTFOUND.CODE, "No row updated", req.data);
            req.response = response;

            return next();
        } catch (err) {
            await t.rollback();
            response = responseHandler(httpCodes.NOTFOUND.CODE, "Failed to updating user", err)
            req.response = response;

            return next();
        }
    }

    DeleteUser = async (req, _, next) => {
        const t = await sequelize.transaction();
        let response = {};
        try {
            const { user_id } = req.data;
            const data = await users.destroy({
                where: {
                    id: user_id
                },
                transaction: t
            });

            if (data == 1) {
                await t.commit();
                response = responseHandler(httpCodes.ACCEPTED.CODE, "Success deleting users")
                req.response = response;

                return next();
            }

            response = responseHandler(httpCodes.NOTFOUND.CODE, "No row deleted")
            req.response = response;

            return next();
        } catch (err) {
            await t.rollback();
            response = responseHandler(httpCodes.INTERNAL_ERROR.CODE, "Failed to delete user", err);
            req.response = response;

            return next();
        }
    }
}

module.exports = new Users;