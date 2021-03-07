const { Sequelize, DataTypes } = require("sequelize");

module.exports = class User extends Sequelize.Model {
  static init(sequelize) {
    return super.init(
      {
        id: {
          type: DataTypes.UUID,
          defaultValue: Sequelize.UUIDV4,
          allowNull: false,
          primaryKey: true,
        },
        email: {
          type: DataTypes.STRING(40),
          allowNull: false,
          validate: {
            isEmail: true,
          },
          unique: true,
        },
        nick: {
          type: DataTypes.STRING(20),
          allowNull: false,
          unique: true,
          // primaryKey: true,
        },
        provider: {
          type: DataTypes.STRING(10),
          allowNull: false,
        },
        oAuthId: {
          type: DataTypes.STRING(255),
          allowNull: false,
        },
      },
      {
        sequelize,
        modelName: "User",
        timestamps: true,
        charset: "utf8",
        collate: "utf8_general_ci",
      }
    );
  }

  static associate(db) {
    db.User.hasMany(db.Playlist, { foreignKey: "owner", sourceKey: "nick" });
  }
};
