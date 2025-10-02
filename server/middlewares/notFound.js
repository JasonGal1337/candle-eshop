module.exports = (req, res, next) => {
  res.status(404).json({
    error: "NotFound",
    message: `Route ${req.method} ${req.originalUrl} not found`,
  });
};