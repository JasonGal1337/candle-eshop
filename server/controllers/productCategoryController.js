const prisma = require("../prisma/prismaClient");

// GET /productCategory
// List all links (with product & category info)
exports.list = async (_req, res, next) => {
  try {
    const rows = await prisma.productCategory.findMany({
      include: { product: true, category: true },
      orderBy: [{ productId: "asc" }, { categoryId: "asc" }],
    });
    res.json(rows);
  } catch (e) { next(e); }
};

// GET /productCategory/product/:productId
// List categories for a product
exports.listForProduct = async (req, res, next) => {
  try {
    const rows = await prisma.productCategory.findMany({
      where: { productId: req.params.productId },
      include: { category: true },
      orderBy: { categoryId: "asc" },
    });
    res.json(rows);
  } catch (e) { next(e); }
};

// GET /productCategory/category/:categoryId
// List products in a category
exports.listForCategory = async (req, res, next) => {
  try {
    const rows = await prisma.productCategory.findMany({
      where: { categoryId: req.params.categoryId },
      include: { product: true },
      orderBy: { productId: "asc" },
    });
    res.json(rows);
  } catch (e) { next(e); }
};

// POST /productCategory
// body: { productId, categoryId }
exports.create = async (req, res, next) => {
  try {
    const { productId, categoryId } = req.body;
    const link = await prisma.productCategory.create({
      data: { productId, categoryId },
      include: { product: true, category: true },
    });
    res.status(201).json(link);
  } catch (e) {
    // Unique constraint (already linked) is common here
    // P2002 = Unique constraint failed on the fields
    if (e.code === "P2002") {
      return res.status(409).json({ error: "Link already exists" });
    }
    next(e);
  }
};

// DELETE /productCategory/:productId/:categoryId
exports.remove = async (req, res, next) => {
  try {
    const { productId, categoryId } = req.params;
    await prisma.productCategory.delete({
      where: { productId_categoryId: { productId, categoryId } },
    });
    res.status(204).end();
  } catch (e) { next(e); }
};