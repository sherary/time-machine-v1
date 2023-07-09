module.exports = (sequelize, DataTypes) => {
  const Teams = sequelize.define('Teams', {
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
        model: 'Users',
        key: 'id'
      },
      onDelete: 'cascade'
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
      modelName: 'Teams',
      tableName: 'Teams',
      freezeTableName: true,
      timestamp: true,
  })

  return Teams
}