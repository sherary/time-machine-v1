module.exports = (sequelize, DataTypes) => {
  const Friendlists = sequelize.define('Friendslists', {
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: DataTypes.INTEGER(10)
    },

    userID: {
      type: DataTypes.INTEGER(10),
      allowNull: false
    },

    lists: {
      type: DataTypes.JSON(),
      allowNull: false,
      defaultValue: {}
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
      modelName: 'Friendslists',
      tableName: 'Friendslists',
      freezeTableName: true,
      timestamp: true,
  })

  return Friendlists
}