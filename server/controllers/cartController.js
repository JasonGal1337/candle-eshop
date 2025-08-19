const prisma = require("../prisma/prismaClient");

// Helper: compute subtotal from items
async function computeTotals(cartId) {
  const items = await prisma.cartItem.findMany({ where: { cartId } });
  const subtotal = items.reduce((s, i) => s + Number(i.price) * i.quantity, 0);
  return { subtotal, items };
}

// GET /cart/by-session/:sessionId
// GET /cart/by-user/:userId
exports.getBySession = async (req, res, next) => {
  try {
    const cart = await prisma.cart.findUnique({
      where: { sessionId: req.params.sessionId },
      include: { items: { include: { product: true } } },
    });
    res.json(cart || null);
  } catch (e) { next(e); }
};

exports.getByUser = async (req, res, next) => {
  try {
    const carts = await prisma.cart.findMany({
      where: { userId: req.params.userId },
      orderBy: { updatedAt: "desc" },
      include: { items: { include: { product: true } } },
    });
    res.json(carts[0] || null);
  } catch (e) { next(e); }
};

// POST /cart (create)
// body: { userId?, sessionId? }
exports.create = async (req, res, next) => {
  try {
    const created = await prisma.cart.create({ data: req.body });
    res.status(201).json(created);
  } catch (e) { next(e); }
};

// POST /cart/:cartId/add
// body: { productId, quantity }
exports.addItem = async (req, res, next) => {
  try {
    const { cartId } = req.params;
    const { productId, quantity } = req.body;

    const product = await prisma.product.findUnique({ where: { id: productId } });
    if (!product) return res.status(400).json({ error: "Invalid product" });

    // price snapshot from product at the time of adding
    const price = product.price;

    // upsert by (cartId, productId)
    const item = await prisma.cartItem.upsert({
      where: { cartId_productId: { cartId, productId } },
      create: { cartId, productId, quantity, price },
      update: { quantity: { increment: quantity } },
      include: { product: true },
    });

    // bump cart updatedAt
    await prisma.cart.update({ where: { id: cartId }, data: { updatedAt: new Date() } });

    res.status(201).json(item);
  } catch (e) { next(e); }
};

// PATCH /cart/:cartId/item/:itemId
// body: { quantity }
exports.updateItem = async (req, res, next) => {
  try {
    const updated = await prisma.cartItem.update({
      where: { id: req.params.itemId },
      data: { quantity: req.body.quantity },
      include: { product: true },
    });
    await prisma.cart.update({ where: { id: req.params.cartId }, data: { updatedAt: new Date() } });
    res.json(updated);
  } catch (e) { next(e); }
};

// DELETE /cart/:cartId/item/:itemId
exports.removeItem = async (req, res, next) => {
  try {
    await prisma.cartItem.delete({ where: { id: req.params.itemId } });
    await prisma.cart.update({ where: { id: req.params.cartId }, data: { updatedAt: new Date() } });
    res.status(204).end();
  } catch (e) { next(e); }
};

// DELETE /cart/:cartId/clear
exports.clear = async (req, res, next) => {
  try {
    await prisma.cartItem.deleteMany({ where: { cartId: req.params.cartId } });
    await prisma.cart.update({ where: { id: req.params.cartId }, data: { updatedAt: new Date() } });
    res.status(204).end();
  } catch (e) { next(e); }
};