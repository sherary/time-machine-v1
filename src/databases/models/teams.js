module.exports = (sequelize, DataTypes) => {
  const Teams = sequelize.define('Teams', {
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: DataTypes.INTEGER(10)
    },

    creatorID: {
      type: DataTypes.INTEGER(10),
      allowNull: false,
      references: {
        model: 'Users',
        key: 'id'
      },
      onDelete: 'cascade'
    },

    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },

    description: {
      type: DataTypes.STRING,
      allowNull: true,
    },
  }, {
      sequelize,
      modelName: 'Teams',
      tableName: 'Teams',
      freezeTableName: true,
      timestamps: true,
  })

  return Teams
}