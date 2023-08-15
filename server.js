const express = require('express');
require("dotenv").config()
const db = require('./src/databases/models');
const app = express();
const session = require('express-session');
const { SERVER_HOST, SERVER_PORT, PASSPORT_KEY } = process.env;
const PORT = SERVER_PORT || 3000;
const { ErrorLogger, AccessLogger } = require('./src/middlewares/index');
const passport = require('passport');

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(session({
    secret: PASSPORT_KEY,
    resave: false,
    saveUninitialized: false
}))
app.use(passport.initialize());
app.use(passport.session());
app.use(ErrorLogger);
app.use(AccessLogger);

const indexRoute = require('./src/routers/index');

app.use('/', indexRoute);

db.sequelize.sync().then(() => {
    app.listen(PORT, () => {
        console.log(`Server run on ${SERVER_HOST}:${SERVER_PORT} 🚀`)
    })
})

module.exports = app;