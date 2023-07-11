const { httpCodes } = require('../helpers/Constants');

class ParsedError {
    constructor() {
        this.name = 'ParsedError';
    }

    createResponse (message, error, statusCode, statusMessage) {
        return {
            success: false,
            status: statusMessage,
            code: statusCode,
            message: message || '',
            error,
        };
    }

    BadRequest (message, data) {
        return this.createResponse(message, data, httpCodes.BAD_REQUEST.CODE, httpCodes.BAD_REQUEST.MESSAGE);
    }

    Unauthorized (message, data) {
        return this.createResponse(message, data, httpCodes.UNAUTHORIZED.CODE, httpCodes.UNAUTHORIZED.MESSAGE);
    }

    Forbidden (message, data) {
        return this.createResponse(message, data, httpCodes.FORBIDDEN.CODE, httpCodes.FORBIDDEN.MESSAGE);
    }

    NotFound (message, data) {
        return this.createResponse(message, data, httpCodes.NOTFOUND.CODE, httpCodes.NOTFOUND.MESSAGE);
    }

    Conflict (message, data) {
        return this.createResponse(message, data, httpCodes.CONFLICT.CODE, httpCodes.CONFLICT.MESSAGE);
    }

    InternalError (message, data) {
        return this.createResponse(message, data, httpCodes.INTERNAL_ERROR.CODE, httpCodes.INTERNAL_ERROR.MESSAGE);
    }
}

module.exports = ParsedError;