module.exports = (sequelize, DataTypes) => {
  const Friendlists = sequelize.define('Friends', {
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

    friendID: {
      type: DataTypes.INTEGER(10),
      allowNull: true,
      references: {
        model: 'Users',
        key: 'id'
      },
      onDelete: 'cascade',
    },

    status: {
      allowNull: false,
      type: DataTypes.ENUM('Pending', 'Accepted'),
      defaultValue: 'Pending'
    },

    capsule_total: {
      allowNull: false,
      type: DataTypes.INTEGER,
      defaultValue: 0,
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
      modelName: 'Friends',
      tableName: 'Friends',
      freezeTableName: true,
      timestamp: true,
  })

  return Friendlists
}