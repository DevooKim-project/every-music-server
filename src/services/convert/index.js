const youtubeService = require("./youtube");
const spotifyService = require("./spotify");
const { uploadArtistTrack, uploadPlaylist, splitArray } = require("./common");

exports.youtubeService = youtubeService;
exports.spotifyService = spotifyService;
exports.uploadArtistTrack = uploadArtistTrack;
exports.uploadPlaylist = uploadPlaylist;
exports.splitArray = splitArray;
