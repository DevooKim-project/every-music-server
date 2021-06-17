const dotenv = require("dotenv");
const path = require("path");
const Joi = require("joi");

if (process.env.NODE_ENV === "production") {
  dotenv.config({ path: path.join(__dirname, "../../.env.production") });
} else if (process.env.NODE_ENV === "development") {
  dotenv.config({ path: path.join(__dirname, "../../.env.development") });
} else {
  throw new Error("process.env.NODE_ENV Not Found");
}

const envVarsSchema = Joi.object()
  .keys({
    NODE_ENV: Joi.string().valid("production", "development", "test").required(),
    PORT: Joi.number().default(8000),
    MONGODB_URL: Joi.string().required().description("Mongo DB url"),
    REDIS_URL: Joi.string().required().description("Redis url"),
    KAKAO_ADMIN: Joi.string().required().description("Kakao admin key"),
    KAKAO_ID: Joi.string().required().description("Kakao ID key"),
    KAKAO_SECRET: Joi.string().required().description("Kakao secret key"),
    GOOGLE_ID: Joi.string().required().description("Google ID key"),
    GOOGLE_SECRET: Joi.string().required().description("Google secret key"),
    SPOTIFY_ID: Joi.string().required().description("Spotify ID key"),
    SPOTIFY_SECRET: Joi.string().required().description("Spotify secret key"),
    COOKIE_SECRET: Joi.string().required().description("Cookie secret key"),
    JWT_SECRET: Joi.string().required().description("JWT secret key"),
    JWT_ACCESS_EXPIRATION_MINUTES: Joi.number().default(60).description("access token expire time(Minutes)"),
    JWT_REFRESH_EXPIRATION_DAYS: Joi.number().default(30).description("refresh token expire time(Days)"),
  })
  .unknown();

const { value: envVars, error } = envVarsSchema.prefs({ errors: { label: "key" } }).validate(process.env);

if (error) {
  throw new Error(`Config validation error: ${error.message}`);
}

module.exports = {
  env: envVars.NODE_ENV,
  port: envVars.PORT,
  cookieSecret: envVars.COOKIE_SECRET,
  token: {
    kakaoAdmin: envVars.KAKAO_ADMIN,
    kakaoId: envVars.KAKAO_ID,
    kakaoSecret: envVars.KAKAO_SECRET,
    googleId: envVars.GOOGLE_ID,
    googleSecret: envVars.GOOGLE_SECRET,
    spotifyId: envVars.SPOTIFY_ID,
    spotifySecret: envVars.SPOTIFY_SECRET,
  },
  jwt: {
    secret: envVars.JWT_SECRET,
    accessExpirationMinutes: envVars.JWT_ACCESS_EXPIRATION_MINUTES,
    refreshExpirationDays: envVars.JWT_REFRESH_EXPIRATION_DAYS,
  },
  mongoose: {
    url: envVars.MONGODB_URL,
    options: {
      useNewUrlParser: true,
      useCreateIndex: true,
      useUnifiedTopology: true,
      useFindAndModify: false,
    },
  },
  redis: {
    url: envVars.REDIS_URL,
  },
};
