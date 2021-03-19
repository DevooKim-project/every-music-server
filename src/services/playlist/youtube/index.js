const playList = require("./playList");
const track = require("./track");

const splitArray50 = (array) => {
  let start = 0;
  let end = 50;
  const result = [];
  while (start < array.length) {
    result.push(array.slice(start, end));
    start = end;
    end += 50;
  }
  return result;
};

module.exports = {
  splitArray50,
  playList,
  track,
};
