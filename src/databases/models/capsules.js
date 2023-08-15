module.exports = (sequelize, DataTypes) => {
  const Capsules = sequelize.define('Capsules', {
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

    jointID: {
      type: DataTypes.INTEGER(10),
      allowNull: true,
    },

    teamID: {
      type: DataTypes.INTEGER(10),
      allowNull: true,
      references: {
        model: 'Teams',
        key: 'id'
      },
      onDelete: 'cascade'
    },

    comment_cluster_ID: {
      type: DataTypes.STRING(50),
      allowNull: true,
    },

    title: {
      type: DataTypes.STRING(100),
      allowNull: false
    },

    content: {
      type: DataTypes.TEXT,
      allowNull: false
    },

    pictures: {
      type: DataTypes.STRING,
      allowNull: true
    },

    sound: {
      type: DataTypes.STRING,
      allowNull: true
    },

    video: {
      type: DataTypes.STRING,
      allowNull: true
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
      modelName: 'Capsules',
      tableName: 'Capsules',
      freezeTableName: true,
      timestamp: true,
  })

  return Capsules
}