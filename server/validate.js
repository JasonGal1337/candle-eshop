import { ZodError } from "zod";

export function validate(schema) {
  return (req, res, next) => {
    try {
      // Parse and validate request body against the Zod schema
      req.validated = schema.parse(req.body);

      // If it's valid, continue to the next middleware/route
      next();
    } catch (err) {
      if (err instanceof ZodError) {
        // If validation fails → return a 400 with clean error info
        return res.status(400).json({
          error: "ValidationError",
          issues: err.issues.map(i => ({
            path: i.path.join("."),   // which field
            message: i.message        // what went wrong
          })),
        });
      }
      // If it's some other error, pass it on
      next(err);
    }
  };
}