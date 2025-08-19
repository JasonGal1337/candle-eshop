const prisma = require("../prisma/prismaClient");

// GET /productImage/product/:productId
exports.listForProduct = async (req, res, next) => {
  try {
    const rows = await prisma.productImage.findMany({
      where: { productId: req.params.productId },
      orderBy: { position: "asc" },
    });
    res.json(rows);
  } catch (e) { next(e); }
};

// POST /productImage
// body: { productId, url, alt?, position?, publicId? }
exports.create = async (req, res, next) => {
  try {
    const created = await prisma.productImage.create({ data: req.body });
    res.status(201).json(created);
  } catch (e) { next(e); }
};

// PUT /productImage/:id
exports.update = async (req, res, next) => {
  try {
    const updated = await prisma.productImage.update({
      where: { id: req.params.id },
      data: req.body,
    });
    res.json(updated);
  } catch (e) { next(e); }
};

// DELETE /productImage/:id
exports.remove = async (req, res, next) => {
  try {
    await prisma.productImage.delete({ where: { id: req.params.id } });
    res.status(204).end();
  } catch (e) { next(e); }
};