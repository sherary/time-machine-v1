const httpCodes = {
    SUCCESS: {
        CODE: 200,
        MESSAGE: "OK",
    },

    CREATED: {
        CODE: 201,
        MESSAGE: "Created",
    },

    ACCEPTED: {
        CODE: 202,
        MESSAGE: "Accepted"
    },

    BAD_REQUEST: {
        CODE: 400,
        MESSAGE: "Bad Request",
    },

    UNAUTHORIZED: {
        CODE: 401,
        MESSAGE: "Unauthorized",
    },

    FORBIDDEN: {
        CODE: 403,
        MESSAGE: "Forbidden",
    },

    NOTFOUND: {
        CODE: 404,
        MESSAGE: "Not Found",
    },

    CONFLICT: {
        CODE: 409,
        MESSAGE: "Conflict",
    },

    INTERNAL_ERROR: {
        CODE: 500,
        MESSAGE: "Internal Server Error",
    }
}

module.exports = {
    httpCodes
}