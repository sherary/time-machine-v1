module.exports = (sequelize, DataTypes) => {
  const DeviceManagement = sequelize.define('DeviceManagement', {
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: DataTypes.INTEGER(10)
    },

    userID: {
      type: DataTypes.INTEGER(10),
      allowNull: false,
      references: {
        models: 'Users',
        key: 'id'
      },
      onDelete: 'cascade'
    },

    agent: {
      type: DataTypes.STRING,
      allowNull: true
    },

    OS: {
      type: DataTypes.STRING,
      allowNull: true
    },

    location: {
      type: DataTypes.STRING,
      allowNull: true
    },

    last_login: {
      type: DataTypes.DATE,
      allowNull: true
    },

    isLoggedIn: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
      allowNull: false
    },

    createdAt: {
      allowNull: false,
      type: DataTypes.DATE
    },

    updatedAt: {
      allowNull: false,
      type: DataTypes.DATE
    }
  }, {
      sequelize,
      modelName: 'DeviceManagement',
      tableName: 'DeviceManagement',
      freezeTableName: true,
      timestamp: true,
  })

  return DeviceManagement
}