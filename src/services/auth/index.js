const googleService = require("./google");
const localService = require("./local");
const kakaoService = require("./kakao");
const spotifyService = require("./spotify");

exports.googleService = googleService;
exports.localService = localService;
exports.kakaoService = kakaoService;
exports.spotifyService = spotifyService;

exports.parseToken = (token) => {
  const newToken = token.replace(/^Bearer\s+/, "");
  return newToken;
};

exports.checkScope = (response_scope, necessary_scope) => {
  //response_scope는 공백으로 구분
  const scope = new Set(
    response_scope.split(" ").filter((v) => v !== "openid")
  );

  // necessary_scope.forEach((v) => {
  //   console.log("test: ", v);
  //   if (!scope.has(v)) {
  //     return false;
  //   }
  // });
  for (ns of necessary_scope) {
    if (!scope.has(ns)) {
      return false;
    }
  }
  return true;
};
