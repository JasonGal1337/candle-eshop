const isProd = process.env.NODE_ENV === "production";

function normalizePrismaError(err) {
  // Prisma Known Request Errors:
  // https://www.prisma.io/docs/reference/api-reference/error-reference
  if (err.code === "P2002") {
    // Unique constraint failed (e.g., duplicate email)
    return {
      status: 409,
      error: "Conflict",
      message: "A record with that unique value already exists.",
      code: err.code,
      details: err.meta,
    };
  }
  if (err.code === "P2025") {
    // Record not found
    return {
      status: 404,
      error: "NotFound",
      message: "The requested resource was not found.",
      code: err.code,
      details: err.meta,
    };
  }
  // Fallback for other Prisma errors
  return {
    status: 500,
    error: "PrismaError",
    message: "Database error.",
    code: err.code,
  };
}

function normalizeZodError(err) {
  return {
    status: 400,
    error: "ValidationError",
    message: "Invalid request data.",
    details: err.errors?.map(e => ({
      path: e.path?.join("."),
      message: e.message
    })),
  };
}

function normalizeJwtError(err) {
  // e.g. JsonWebTokenError, TokenExpiredError (from jsonwebtoken)
  const base = { error: "AuthError", message: err.message || "Invalid token" };
  if (err.name === "TokenExpiredError") {
    return { status: 401, ...base, message: "Token expired" };
  }
  return { status: 401, ...base };
}

module.exports = (err, req, res, next) => {
  // 1) Known typed errors -> map to clean API responses
  let payload;

  // zod
  if (err.name === "ZodError") {
    payload = normalizeZodError(err);
  }
  // prisma
  else if (err.code && typeof err.code === "string" && err.clientVersion) {
    payload = normalizePrismaError(err);
  }
  // JWT
  else if (err.name === "JsonWebTokenError" || err.name === "TokenExpiredError") {
    payload = normalizeJwtError(err);
  }
  // custom error with status
  else if (typeof err.status === "number") {
    payload = {
      status: err.status,
      error: err.name || "Error",
      message: err.message || "Request failed",
      details: err.details,
    };
  }
  // fallback
  else {
    payload = {
      status: 500,
      error: err.name || "Error",
      message: err.message || "Internal Server Error",
    };
  }

  // 2) Log full error on the server (kept out of the client)
  // You can replace with pino later
  if (!isProd) {
    // In dev, include a short stack in response to help you debug
    payload.stack = err.stack;
  } else {
    // In prod, only log stack server-side
    console.error(err);
  }

  res.status(payload.status).json({
    error: payload.error,
    message: payload.message,
    code: payload.code,
    details: payload.details,
    // Only show stack to client in dev:
    ...(payload.stack ? { stack: payload.stack } : {}),
  });
};