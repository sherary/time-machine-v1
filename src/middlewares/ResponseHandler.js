const ParsedError = require("./Error");

const customErrorHandler = (err, req, res, next) => {
    if (err instanceof ParsedError) {
        return res.status(err.code).json({
            message: err.message || "An error occurred",
        })
    } else {
        next(err);
    }
};

module.exports = {
    customErrorHandler,
}