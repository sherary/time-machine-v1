module.exports = (sequelize, DataTypes) => {
  const TeamMembers = sequelize.define('TeamMembers', {
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: DataTypes.INTEGER(10),
    },

    teamID: {
      type: DataTypes.INTEGER(10),
      allowNull: false,
      references: {
        model: 'Teams',
        key: 'id'
      },
      onDelete: 'cascade'
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

    status: {
      type: DataTypes.ENUM('Pending', 'Accepted', 'Blocked'),
      allowNull: false,
      defaultValue: 'Pending'
    },

    contributions: {
      type: DataTypes.NUMBER,
      allowNull: false,
      defaultValue: 0
    },
  }, {
    sequelize,
    modelName: 'TeamMembers',
    tableName: 'TeamMembers',
    freezeTableName: true,
    timestamps: true
  })

  return TeamMembers;
}