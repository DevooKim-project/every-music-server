const { createLogger, format, transports } = require("winston");
const { combine, timestamp, label, printf } = format;
const winstonDaily = require("winston-daily-rotate-file");
const config = require("./config");

const logDir = "logs";

const logFormat = printf((info) => {
  return `${info.timestamp} : ${info.message}`;
});

const logger = createLogger({
  level: config.env === "development" ? "debug" : "info",
  format: combine(timestamp(), logFormat),
  transports: [
    // info 레벨 로그를 저장할 파일 설정
    new winstonDaily({
      level: "info",
      dirname: logDir,
      filename: "everyMusic-%DATE%.log",
      datePattern: "YYYY-MM-DD",
      zippedArchive: true,
      maxSize: "20m",
      maxFiles: "14d",
    }),
    // error 레벨 로그를 저장할 파일 설정
    new winstonDaily({
      level: "error",
      dirname: logDir + "/error",
      filename: "everyMusic-%DATE%.error.log",
      datePattern: "YYYY-MM-DD",
      zippedArchive: true,
      maxSize: "20m",
      maxFiles: "14d",
    }),
  ],
});

if (process.env.NODE_ENV !== "production") {
  logger.add(new transports.Console(format.colorize(), format.simple()));
}

module.exports = logger;
