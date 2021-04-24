const { userService, playlistService } = require("../../services");
const catchAsync = require("../../utils/catchAsync");

const getLibrary = catchAsync(async (req, res) => {
  const user = await userService.getUserById(req.payload.id);
  await user.execPopulate("likePlaylists");

  const library = user.likePlaylists;
  res.send(library);
});

module.exports = { getLibrary };
