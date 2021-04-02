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
          type: DataTypes.STRING(255),
          allowNull: true,
          validate: {
            isEmail: true,
          },
        },
        nick: {
          type: DataTypes.STRING(40),
          allowNull: false,
        },
        // playList: {
        //   type: DataTypes.STRING,
        //   get() {
        //     return this.getDataValue("playList").split(";");
        //   },
        //   set(val) {
        //     return this.setDataValue("playList", val.join(";"));
        //   },
        // },
        provider: {
          type: DataTypes.STRING(20),
          allowNull: false,
        },
        providerId: {
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

  static associate(db) {}
};
