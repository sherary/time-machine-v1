const { Sequelize, DataTypes } = require('sequelize');
const env = process.env.NODE_ENV || "development";
const config = require('../../../config/config')[env];

const sequelize = new Sequelize(
    config.database, config.username, config.password, {
        host: config.host,
        dialect: config.dialect,
        pool: {
            max: config.pool.max,
            min: config.pool.min,
            acquire: config.pool.acquire,
            idle: config.pool.idle
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
db.friends = require('./friendlists')(sequelize, DataTypes);
db.teams = require('./teams')(sequelize, DataTypes);
db.team_members = require('./members')(sequelize, DataTypes);
db.capsules = require('./capsules')(sequelize, DataTypes);
db.device_management = require('./device_management')(sequelize, DataTypes);

db.users.hasMany(db.friends, {
    foreignKey: 'userID',
    as: 'user',
    onDelete: 'cascade'
})

db.users.hasMany(db.friends, {
    foreignKey: 'friendID',
    as: 'friend',
    onDelete: 'cascade'
})

db.friends.belongsTo(db.users, {
    foreignKey: 'userID',
    as: 'user'
})

db.friends.belongsTo(db.users, {
    foreignKey: 'friendID',
    as: 'friend'
})

db.users.hasMany(db.teams, {
    foreignKey: 'creatorID',
    as: 'teams',
    onDelete: 'cascade'
})

db.teams.belongsTo(db.users, {
    foreignKey: 'creatorID',
    as: 'teams'
})

db.users.hasMany(db.capsules, {
    foreignKey: 'userID',
    as: 'capsules',
    onDelete: 'cascade'
})

db.capsules.belongsTo(db.users, {
    foreignKey: 'userID',
    as: 'users',
})

db.teams.hasMany(db.capsules, {
    foreignKey: 'teamID',
    as: 'capsule',
    onDelete: 'cascade'
})

db.capsules.belongsTo(db.teams, {
    foreignKey: 'teamID',
    as: 'teams'
})

db.teams.hasMany(db.team_members, {
    foreignKey: 'teamID',
    as: 'members',
    onDelete: 'cascade'
})

db.team_members.belongsTo(db.teams, {
    foreignKey: 'teamID',
    as: 'teams_members'
})

db.users.hasMany(db.team_members, {
    foreignKey: 'userID',
    as: 'teamMembers',
    onDelete: 'cascade'
})

db.team_members.belongsTo(db.users, {
    foreignKey: 'userID',
    as: 'team_members'
})

db.users.hasMany(db.device_management, {
    foreignKey: 'userID',
    as: 'users_devices',
    onDelete: 'cascade'
})

db.device_management.belongsTo(db.users, {
    foreignKey: 'userID',
    as: 'users'
})

module.exports = db