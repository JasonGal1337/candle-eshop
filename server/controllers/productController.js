const prisma = require("../prisma/prismaClient");

// GET /product
exports.list = async (_req, res, next) => {
  try {
    const rows = await prisma.product.findMany({
      orderBy: { createdAt: "desc" },
      include: { images: true, categories: { include: { category: true } }, reviews: true },
    });
    res.json(rows);
  } catch (e) { next(e); }
};

// GET /product/:id
exports.get = async (req, res, next) => {
  try {
    const row = await prisma.product.findUnique({
      where: { id: req.params.id },
      include: { images: true, categories: { include: { category: true } }, reviews: true },
    });
    if (!row) return res.status(404).json({ error: "Not Found" });
    res.json(row);
  } catch (e) { next(e); }
};

// GET /product/slug/:slug
exports.getBySlug = async (req, res, next) => {
  try {
    const row = await prisma.product.findUnique({
      where: { slug: req.params.slug },
      include: { images: true, categories: { include: { category: true } }, reviews: true },
    });
    if (!row) return res.status(404).json({ error: "Not Found" });
    res.json(row);
  } catch (e) { next(e); }
};

// POST /product
// Accepts optional: categoryIds: string[], images: [{url, alt?, position?}]
exports.create = async (req, res, next) => {
  try {
    const { categoryIds, images, ...data } = req.body;

    const created = await prisma.product.create({
      data: {
        ...data,
        // join table entries
        categories: categoryIds?.length
          ? { create: categoryIds.map((id) => ({ categoryId: id })) }
          : undefined,
        // product images
        images: images?.length ? { create: images } : undefined,
      },
      include: { images: true, categories: { include: { category: true } } },
    });
    res.status(201).json(created);
  } catch (e) { next(e); }
};

// PUT /product/:id
exports.update = async (req, res, next) => {
  try {
    const { categoryIds, ...data } = req.body;

    const updated = await prisma.product.update({
      where: { id: req.params.id },
      data: {
        ...data,
        // if categoryIds is provided, reset links to match
        ...(Array.isArray(categoryIds)
          ? {
              categories: {
                deleteMany: {},
                create: categoryIds.map((id) => ({ categoryId: id })),
              },
            }
          : {}),
      },
      include: { images: true, categories: { include: { category: true } } },
    });

    res.json(updated);
  } catch (e) { next(e); }
};

// DELETE /product/:id
exports.remove = async (req, res, next) => {
  try {
    await prisma.product.delete({ where: { id: req.params.id } });
    res.status(204).end();
  } catch (e) { next(e); }
};