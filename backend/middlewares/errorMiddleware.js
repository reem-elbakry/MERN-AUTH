//last middleware in req res cycle
const errorHandler = async (err, req, res, next) => {
  const statusCode = res.statusCode ? res.statusCode : 500;

  res.status(statusCode);
  res.json({
    status: "failed",
    message: err.message,
  });
};

module.exports = { errorHandler };
