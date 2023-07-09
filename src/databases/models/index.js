const { Sequelize, DataTypes } = require('sequelize');
const env = process.env.NODE_ENV || "development";
const config = require('../../../config/config')(env);

const sequelize = new Sequelize(
    config.database, config.username, config.password, {
        host: config.host,
        dialect: config.dialect,
        pool: {
            max: config.pool.max,
            min: config.pool.min,
            acquire: config.pool.acquire,
            idle: config.poo.idle
        },
        port: 3306
    }
)

sequelize.authenticate()
    .then(() => {
        console.log("Connection has been established successfully.");
    })
    .catch(err => {
        console.error("Unable to connect to the database:", err);
    })

const db = {}

db.Sequelize = Sequelize
db.sequelize = sequelize

db.users = require('./users')(sequelize, DataTypes);
db.friendslists = require('./friendlists')(sequelize, DataTypes);
db.teams = require('./teams')(sequelize, DataTypes);
db.capsules = require('./capsules')(sequelize, DataTypes);

module.exports = db