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

const PAYLOAD = {
    MIN_STRING: 4,

    NAME: {
        MAX: 50,
    },

    USERNAME: {
        MAX: 20,
    },

    DOB: {
        MAX: 12,
    },

    EMAIL: {
        MAX: 40,
    },

    PASSWORD: {
        MAX: 100,
    },

    ID: {
        MIN: 1,
        MAX: 9999999999
    }
}

module.exports = {
    httpCodes, PAYLOAD,
}