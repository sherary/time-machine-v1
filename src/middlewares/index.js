const colors = require('colors-cli');
const green = colors.green;
const red = colors.red_b;

const ErrorLogger = (err, req, res, next) => {
    const { hostname, method, path, protocol } = req;
    
    console.log(red(`ERROR: ${method} ${protocol}://${hostname} ${path} - ${err}`));
    next();
};

const AccessLogger = (req, res, next) => {
    const { hostname, method, path, protocol } = req;
    
    console.log(green(`ACCESS: ${method} ${protocol}://${hostname} ${path}`));
    next();
};

module.exports = { ErrorLogger, AccessLogger };