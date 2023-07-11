const { httpCodes } = require('../helpers/Constants');

class ParsedSuccess {
    constructor() {
        this.name = 'ParsedSuccess';
    }

    createResponse (message, data, statusCode, statusMessage) {
        return {
            success: true,
            status: statusMessage,
            code: statusCode,
            message: message || '',
            data,
        };
    }

    OK (message, data) {
        return this.createResponse(message, data, httpCodes.SUCCESS.CODE, httpCodes.SUCCESS.MESSAGE);
    }

    Created (message, data) {
        return this.createResponse(message, data, httpCodes.CREATED.CODE, httpCodes.CREATED.MESSAGE);
    }

    Accepted (message, data) {
        return this.createResponse(message, data, httpCodes.ACCEPTED.CODE, httpCodes.ACCEPTED.MESSAGE);
    }
}

module.exports = ParsedSuccess;