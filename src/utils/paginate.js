const paginate = async (schema, filter, options, path = undefined) => {
  const limit = options.limit && parseInt(options.limit, 10) > 0 ? parseInt(options.limit, 10) : 0;
  const page = options.page && parseInt(options.page, 10) > 0 ? parseInt(options.page, 10) : 1;
  const sort = options.sort ? options.sort : "createdAt";
  const skip = (page - 1) * limit;

  const countPromise = schema.countDocuments(filter).exec();
  const docsPromise = schema.find(filter).sort(sort).skip(skip).limit(limit).populate(path);

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
