const errorHandler = (err, req, res, next) => {
  const error = err.error ? err.error : err;
  const statusCode = err.status || 500;
  console.error(error);
  res.status(statusCode).json({ message: error.message });
};

const notFound = (req, res, next) => {
  res.status(404).send("Resource not found");
};

module.exports = {
  errorHandler,
  notFound,
};
