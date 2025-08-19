const prisma = require("../prisma/prismaClient");

// POST /cartItem
// body: { cartId, productId, quantity }
exports.create = async (req, res, next) => {
  try {
    const { cartId, productId, quantity } = req.body;
    const product = await prisma.product.findUnique({ where: { id: productId } });
    if (!product) return res.status(400).json({ error: "Invalid product" });

    const created = await prisma.cartItem.create({
      data: { cartId, productId, quantity, price: product.price },
      include: { product: true },
    });
    await prisma.cart.update({ where: { id: cartId }, data: { updatedAt: new Date() } });
    res.status(201).json(created);
  } catch (e) { next(e); }
};

// PATCH /cartItem/:id  body: { quantity }
exports.update = async (req, res, next) => {
  try {
    const updated = await prisma.cartItem.update({
      where: { id: req.params.id },
      data: { quantity: req.body.quantity },
    });
    res.json(updated);
  } catch (e) { next(e); }
};

// DELETE /cartItem/:id
exports.remove = async (req, res, next) => {
  try {
    await prisma.cartItem.delete({ where: { id: req.params.id } });
    res.status(204).end();
  } catch (e) { next(e); }
};