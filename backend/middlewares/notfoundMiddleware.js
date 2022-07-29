const notfoundHandler = async (err, req, res, next) => {
  res.status(404);
  res.json({
    status: "failed",
    message: "not found",
  });
};

module.exports = { notfoundHandler };
