const catchAsync = require("../../utils/catchAsync");
const { playlistService } = require("../../services");

const readTrack = catchAsync(async (req, res) => {
  const track = await playlistService.getTrack(req.params.playlistId);
  res.send(track);
});

module.exports = { readTrack };
