module.exports = (sequelize, DataTypes) => {
  const Users = sequelize.define('Users', {
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: DataTypes.INTEGER(10)
    },

    name: {
      type: DataTypes.STRING(50),
      allowNull: false
    },

    dob: {
      type: DataTypes.DATE,
      allowNull: true
    },

    username: {
      type: DataTypes.STRING(20),
      allowNull: true
    },

    email: {
      type: DataTypes.STRING(40),
      allowNull: false
    },

    password: {
      type: DataTypes.STRING(100),
      allowNull: false
    },

    role: {
      type: DataTypes.ENUM(['admin','user']),
      allowNull: false,
      defaultValue: 'user'
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
      modelName: 'Users',
      tableName: 'Users',
      freezeTableName: true,
      timestamp: true,
  })

  return Users
}