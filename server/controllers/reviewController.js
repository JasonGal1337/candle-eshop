const prisma = require("../prisma/prismaClient");

// GET /review/product/:productId
exports.listForProduct = async (req, res, next) => {
  try {
    const rows = await prisma.review.findMany({
      where: { productId: req.params.productId },
      orderBy: { createdAt: "desc" },
      include: { user: { select: { id: true, firstName: true, lastName: true } } },
    });
    res.json(rows);
  } catch (e) { next(e); }
};

// POST /review
// body: { productId, userId, rating, comment? }
exports.create = async (req, res, next) => {
  try {
    const created = await prisma.review.create({ data: req.body });
    res.status(201).json(created);
  } catch (e) { next(e); }
};

// DELETE /review/:id
exports.remove = async (req, res, next) => {
  try {
    await prisma.review.delete({ where: { id: req.params.id } });
    res.status(204).end();
  } catch (e) { next(e); }
};