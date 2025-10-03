const { ZodError } = require("zod");

/**
 * validate(schema, source = "body")
 * - schema: a Zod schema
 * - source: "body" | "params" | "query"
 */
module.exports = function validate(schema, source = "body") {
  return (req, _res, next) => {
    try {
      const parsed = schema.parse(req[source]);
      req[source] = parsed; // use sanitized data downstream
      next();
    } catch (err) {
      if (err instanceof ZodError) err.status = 400; // errorHandler formats this
      next(err);
    }
  };
};