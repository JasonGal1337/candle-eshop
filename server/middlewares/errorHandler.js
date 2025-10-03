const isProd = process.env.NODE_ENV === "production";

function normalizeZodError(err) {
  return {
    status: 400,
    error: "ValidationError",
    message: "Invalid request data.",
    details: err.errors?.map(e => ({
      path: Array.isArray(e.path) ? e.path.join(".") : e.path,
      message: e.message
    })),
  };
}

module.exports = (err, req, res, next) => {
  let payload;

  if (err.name === "ZodError") {
    payload = normalizeZodError(err);
  } else if (err.code && err.clientVersion) {
    // Prisma error fallback
    payload = {
      status: err.status || 500,
      error: "PrismaError",
      message: err.message || "Database error.",
      code: err.code
    };
  } else if (typeof err.status === "number") {
    payload = {
      status: err.status,
      error: err.name || "Error",
      message: err.message || "Request failed",
      details: err.details,
    };
  } else {
    payload = {
      status: 500,
      error: err.name || "Error",
      message: err.message || "Internal Server Error",
    };
  }

  // Log full error on server, but don't send stack to client (even in dev)
  if (!isProd) console.error(err);

  res.status(payload.status).json({
    error: payload.error,
    message: payload.message,
    code: payload.code,
    details: payload.details,
  });
};