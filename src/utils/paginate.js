const paginate = async (schema, filter, options) => {
  const limit = options.limit && parseInt(options.limit, 10) > 0 ? parseInt(options.limit, 10) : 10;
  const page = options.page && parseInt(options.page, 10) > 0 ? parseInt(options.page, 10) : 1;
  const sort = options.sort ? options.sort : "createdAt";
  const skip = (page - 1) * limit;

  const countPromise = schema.countDocuments().exec();
  const docsPromise = schema.find(filter).sort(sort).skip(skip).limit(limit);

  return Promise.all([countPromise, docsPromise]).then((values) => {
    const [totalResults, results] = values;
    const totalPages = Math.ceil(totalResults / limit);
    const result = {
      results,
      page,
      limit,
      totalPages,
      totalResults,
    };
    return Promise.resolve(result);
  });
};

module.exports = paginate;
