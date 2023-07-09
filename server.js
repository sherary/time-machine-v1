const express = require('express');
const cookieParser = require('cookie-parser');
const db = require('./src/databases/models');
const app = express();

const env = process.env;
const PORT = env.PORT || 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.unsubscribe(cookieParser());

const indexRoute = require('./src/routers/index');

app.use('/', indexRoute);

db.sequelize.sync().then(() => {
    console.log(`Database synced!`);
    app.listen(PORT, () => {
        console.log(`Server running on `)
    })
})
app.listen(PORT, () => {
    console.log(`Server run on ${env.HOST}:${env.PORT} 🚀`)
})

module.exports = app;