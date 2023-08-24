const { httpCodes } = require('../helpers/Constants');
const ParsedSuccess = require('./Success');
const ParsedError = require('./Error');
const Success = new ParsedSuccess();
const Error = new ParsedError();

const ResponseMap = (code, message, data) => {
    const responseMap = new Map([
        [200, Success.OK(message, data)],
        [201, Success.Created(message, data)],
        [202, Success.Accepted(message, data)],
        [400, Error.BadRequest(message, data)],
        [401, Error.Unauthorized(message, data)],
        [403, Error.Forbidden(message, data)],
        [404, Error.NotFound(message, data)],
        [409, Error.Conflict(message, data)],
        [500, Error.InternalError(message, data)],
    ]);

    return responseMap.get(code);
}

const SendResponse = () => {
    return async (req, res) => {
        try {
            const { code, message, data } = req.response;
            const response = ResponseMap(code, message, data);
            
            if (!response) {
                console.log("Respnse error: ", response)
            }

            return res.json(response);
        } catch (err) {
            return res.status(httpCodes.INTERNAL_ERROR.CODE).json(Error.InternalError("No listed error found: ", err.message));
        }
    };
}

module.exports = SendResponse;
