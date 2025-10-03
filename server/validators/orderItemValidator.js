const { z } = require("zod");

const orderIdParam = z.object({ orderId: z.coerce.number().int().positive() });
const idParam = z.object({ id: z.coerce.number().int().positive() });

module.exports = { orderIdParam, idParam };