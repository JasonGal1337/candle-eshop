const prisma = require("../prisma/prismaClient");

// GET /orderItem/order/:orderId
exports.listForOrder = async (req, res, next) => {
  try {
    const rows = await prisma.orderItem.findMany({
      where: { orderId: req.params.orderId },
      orderBy: { id: "asc" },
    });
    res.json(rows);
  } catch (e) { next(e); }
};

// DELETE /orderItem/:id
exports.remove = async (req, res, next) => {
  try {
    await prisma.orderItem.delete({ where: { id: req.params.id } });
    res.status(204).end();
  } catch (e) { next(e); }
};