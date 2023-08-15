const { getUserByUsername, getUserByEmail } = require("../../helpers/Commons");
const { httpCodes } = require("../../helpers/Constants");
const ParsedError = require("../Error");
const Error = new ParsedError();

const ValidateCreatePayload = (CreateSchema) => {
    return (req, res, next) => {
        const { error, value } = CreateSchema.validate(req.body);

        if(!error) {
            req.data = value;
            return next();
        }

        return res.status(httpCodes.BAD_REQUEST.CODE).json(Error.BadRequest(error.message.split(/[,\.]/)));
    }
}

const ValidateIDParams = (IDSchema) => {
    return (req, res, next) => {
        const { error, value } = IDSchema.validate(req.params);

        if(!error) {
            req.data = value;
            return next();
        }

        return res.status(httpCodes.BAD_REQUEST.CODE).json(Error.BadRequest(error.message.split(/[,\.]/)));
    }
}

const ValidateUpdatePayload = (IDSchema, UpdateSchema) => {
    return async (req, res, next) => {
        const { error: paramsError, value: paramsValue } = IDSchema.validate(req.params);
        const { error: bodyError, value: bodyValue } = UpdateSchema.validate(req.body);

        let err = ""
        
        if (paramsError) {
            err += `${paramsError.message},`
        }

        if (bodyError) {
            err += `${bodyError.message}`
        }
        
        if (!paramsError && !bodyError) {
            req.data = { ...paramsValue, ...bodyValue }
            return next();
        }

        return res.status(httpCodes.BAD_REQUEST.CODE).json(Error.BadRequest(err.split(/[,\.]/)));
    }
}

const ValidateLoginPayload = (LoginSchema) => {
    return async (req, res, next) => {
        const { error, value } = LoginSchema.validate(req.body);

        if (!error) {
            let data;
            if (value.username) {
                data = await getUserByUsername(value.username);
            } 
            
            if (value.email) {
                data = await getUserByEmail(value.email);
            }
            
            if (data) {
                return next();
            }
            
            return res.status(httpCodes.NOTFOUND.CODE).json(Error.NotFound("User not found"));
        }

        return res.status(httpCodes.UNAUTHORIZED.CODE).json(Error.Unauthorized(error));
    }
}

module.exports = { ValidateCreatePayload, ValidateIDParams, ValidateUpdatePayload, ValidateLoginPayload }