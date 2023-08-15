const { device_management } = require('../databases/models');
const { getUserByColumnAndID } = require('../helpers/Commons');
const { httpCodes } = require('../helpers/Constants');
const ParsedError = require('./Error');
const passport = require('./authenticate.config');
const jwt = require('jsonwebtoken');
const Error = new ParsedError();

const AuthenticateLogin = (req, res, next) => {
    passport.authenticate('login', (err, user) => {
        if (err === 500) {
            return res.status(httpCodes.INTERNAL_ERROR.CODE).json(Error.InternalError("Failed to login: Internal Error"));
        }
        
        if (err === 404) {
            return res.status(httpCodes.NOTFOUND.CODE).json(Error.NotFound("User does not exist"));
        }

        if (err === 401) {
            return res.status(httpCodes.UNAUTHORIZED.CODE).json(Error.Unauthorized("Invalid credentials"));
        }
        req.user = user;

        return next();
    })(req, res, next);
};

const AuthenticateRegister = (req, res, next) => {
    passport.authenticate('register', async (err, _) => {
        if (err === 500) {
            return res.status(httpCodes.INTERNAL_ERROR.CODE).json(Error.InternalError("Failed to register: Internal Error"));
        }

        if (err === 400) {
            return res.status(httpCodes.CONFLICT.CODE).json(Error.Conflict("Email already registered!"));
        }
        
        return next();
    })(req, res, next);
};

const isAuthenticated = async (req, res, next) => {
    if (req.isAuthenticated()) {
        return next();
    }

    const data = await getUserByColumnAndID(device_management, req.data.user_id);
    if (data.isLoggedIn == 0) {
        return res.status(httpCodes.CONFLICT.CODE).json(Error.Conflict("Already Logged out!"));
    }
    
    if (data) {
        req.data = data
        return next();
    }

    return res.status(httpCodes.BAD_REQUEST.CODE).json(Error.BadRequest("Must login first!"));
}

module.exports = { AuthenticateLogin, AuthenticateRegister, isAuthenticated }