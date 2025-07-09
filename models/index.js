const sequelize = require("../config/db");
const User = require("./user");
const Store = require("./store");
const Rating = require("./rating");

module.exports = { sequelize, User, Store, Rating };
