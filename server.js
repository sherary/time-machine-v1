const express = require('express');
const cookieParser = require('cookie-parser');
require("dotenv").config()
const db = require('./src/databases/models');
const app = express();
const { SERVER_HOST, SERVER_PORT } = process.env;
const PORT = SERVER_PORT || 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.unsubscribe(cookieParser());

const indexRoute = require('./src/routers/index');

app.use('/', indexRoute);

db.sequelize.sync().then(() => {
    app.listen(PORT, () => {
        console.log(`Server run on ${SERVER_HOST}:${SERVER_PORT} 🚀`)
    })
})

module.exports = app;