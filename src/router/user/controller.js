const httpStatus = require("http-status");

const { userService } = require("../../services");
const catchAsync = require("../../utils/catchAsync");

const getUserById = catchAsync(async (req, res) => {
  const user = await userService.getUserById(req.params.userId);
  res.send(user);
});

const getLibrary = catchAsync(async (req, res) => {
  const user = await userService.getUserById(req.payload.id);
  await user.execPopulate("likePlaylists");
  const library = user.likePlaylists;

  if (req.params.playlistId) {
    const result = library.find((element) => element.id === req.params.playlistId);
    return res.send({ isLike: result ? true : false });
  }

  library.map((element) => {
    element.tracks = undefined;
  });

  res.send(library);
});

module.exports = { getUserById, getLibrary };
