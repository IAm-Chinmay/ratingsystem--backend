const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");
const User = require("./user");

const Store = sequelize.define("Store", {
  name: DataTypes.STRING,
  email: DataTypes.STRING,
  address: DataTypes.STRING,
});

User.hasMany(Store, { foreignKey: "ownerId" });
Store.belongsTo(User, { foreignKey: "ownerId" });

module.exports = Store;
