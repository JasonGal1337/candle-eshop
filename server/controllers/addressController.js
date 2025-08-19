const prisma = require("../prisma/prismaClient");

// GET /address/user/:userId
exports.listForUser = async (req, res, next) => {
  try {
    const rows = await prisma.address.findMany({
      where: { userId: req.params.userId },
      orderBy: [{ isDefault: "desc" }, { createdAt: "desc" }],
    });
    res.json(rows);
  } catch (e) { next(e); }
};

// POST /address
exports.create = async (req, res, next) => {
  try {
    // If isDefault true, unset others for that user
    const { userId, isDefault } = req.body;
    if (isDefault) {
      await prisma.address.updateMany({
        where: { userId },
        data: { isDefault: false },
      });
    }
    const created = await prisma.address.create({ data: req.body });
    res.status(201).json(created);
  } catch (e) { next(e); }
};

// PUT /address/:id
exports.update = async (req, res, next) => {
  try {
    const { isDefault } = req.body;
    const id = req.params.id;

    if (typeof isDefault === "boolean" && isDefault) {
      const existing = await prisma.address.findUnique({ where: { id } });
      if (existing) {
        await prisma.address.updateMany({
          where: { userId: existing.userId, NOT: { id } },
          data: { isDefault: false },
        });
      }
    }

    const updated = await prisma.address.update({
      where: { id },
      data: req.body,
    });
    res.json(updated);
  } catch (e) { next(e); }
};

// DELETE /address/:id
exports.remove = async (req, res, next) => {
  try {
    await prisma.address.delete({ where: { id: req.params.id } });
    res.status(204).end();
  } catch (e) { next(e); }
};