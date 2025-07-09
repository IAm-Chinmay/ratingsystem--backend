const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");

const User = sequelize.define("User", {
  name: DataTypes.STRING,
  email: { type: DataTypes.STRING, unique: true },
  password: DataTypes.STRING,
  address: DataTypes.STRING,
  role: DataTypes.ENUM("admin", "normal", "store_owner"),
});

module.exports = User;
