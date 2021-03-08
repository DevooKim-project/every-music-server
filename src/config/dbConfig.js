module.exports = {
  development: {
    username: "root",
    password: process.env.MYSQL_PASSWORD,
    database: process.env.DB,
    host: process.env.MYSQL_HOST,
    dialect: "mysql",
  },
  test: {
    username: "root",
    password: process.env.MYSQL_PASSWORD,
    database: process.env.DB,
    host: process.env.MYSQL_HOST,
    dialect: "mysql",
  },
  production: {
    username: "root",
    password: process.env.MYSQL_PASSWORD,
    database: process.env.DB,
    host: process.env.MYSQL_HOST,
    dialect: "mysql",
    logging: false,
  },
};
