const prisma = require("../prisma/prismaClient");

// GET /category
exports.list = async (_req, res, next) => {
  try {
    const rows = await prisma.category.findMany({ orderBy: { title: "asc" } });
    res.json(rows);
  } catch (e) { next(e); }
};

// GET /category/:id
exports.get = async (req, res, next) => {
  try {
    const row = await prisma.category.findUnique({
      where: { id: req.params.id },
      include: { products: { include: { product: true } } },
    });
    if (!row) return res.status(404).json({ error: "Not Found" });
    res.json(row);
  } catch (e) { next(e); }
};

// GET /category/slug/:slug
exports.getBySlug = async (req, res, next) => {
  try {
    const row = await prisma.category.findUnique({
      where: { slug: req.params.slug },
      include: { products: { include: { product: true } } },
    });
    if (!row) return res.status(404).json({ error: "Not Found" });
    res.json(row);
  } catch (e) { next(e); }
};

// POST /category
exports.create = async (req, res, next) => {
  try {
    const created = await prisma.category.create({ data: req.body });
    res.status(201).json(created);
  } catch (e) { next(e); }
};

// PUT /category/:id
exports.update = async (req, res, next) => {
  try {
    const updated = await prisma.category.update({
      where: { id: req.params.id },
      data: req.body,
    });
    res.json(updated);
  } catch (e) { next(e); }
};

// DELETE /category/:id
exports.remove = async (req, res, next) => {
  try {
    await prisma.category.delete({ where: { id: req.params.id } });
    res.status(204).end();
  } catch (e) { next(e); }
};