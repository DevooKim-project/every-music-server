const catchAsync = require("../../utils/catchAsync");
const { playlistService } = require("../../services");

const getTrack = catchAsync(async (req, res) => {
  const track = await playlistService.getTrack(req.params.playlistId);
  res.send(track);
});

module.exports = getTrack;
