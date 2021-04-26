const splitArray = (array, offset) => {
  let start = 0;
  let end = offset;
  const result = [];
  while (start < array.length) {
    result.push(array.slice(start, end));
    start = end;
    end += offset;
  }
  return result;
};

module.exports = splitArray;
