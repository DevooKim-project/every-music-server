// const { createUser, findOneUser, destroyUser } = require("./user");
const userService = require("./user");
const tokenService = require("./token");

exports.userService = userService;
exports.tokenService = tokenService;
