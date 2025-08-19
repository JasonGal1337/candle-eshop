const prisma = require("../prisma/prismaClient");

// POST /order
// body: { userId?, email, items: [{ productId, quantity }], shipping?{...} }
exports.create = async (req, res, next) => {
  try {
    const { userId, email, items, shipping = {} } = req.body;

    if (!Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ error: "No items" });
    }

    // fetch product snapshots
    const productIds = items.map(i => i.productId);
    const products = await prisma.product.findMany({
      where: { id: { in: productIds } },
      select: { id: true, title: true, price: true, stock: true },
    });
    const byId = Object.fromEntries(products.map(p => [p.id, p]));

    // stock check
    for (const i of items) {
      const p = byId[i.productId];
      if (!p) return res.status(400).json({ error: "Invalid product in items" });
      if (p.stock < i.quantity) {
        return res.status(400).json({ error: `Insufficient stock for ${p.title}` });
      }
    }

    // compute totals
    const subtotal = items.reduce((sum, i) => sum + Number(byId[i.productId].price) * i.quantity, 0);
    const shippingCost = 0; // placeholder
    const discount = 0;     // placeholder
    const tax = 0;          // placeholder
    const total = subtotal + shippingCost - discount + tax;

    const created = await prisma.$transaction(async (tx) => {
      const order = await tx.order.create({
        data: {
          userId: userId || null,
          emailSnapshot: email,
          shippingFullName: shipping.fullName ?? null,
          shippingPhone: shipping.phone ?? null,
          shippingLine1: shipping.line1 ?? null,
          shippingLine2: shipping.line2 ?? null,
          shippingCity: shipping.city ?? null,
          shippingRegion: shipping.region ?? null,
          shippingZip: shipping.zip ?? null,
          shippingCountry: shipping.country ?? null,
          subtotal,
          shipping: shippingCost,
          discount,
          tax,
          total,
          items: {
            create: items.map(i => ({
              productId: i.productId,
              nameSnapshot: byId[i.productId].title,
              unitPrice: byId[i.productId].price,
              quantity: i.quantity,
            })),
          },
        },
        include: { items: true },
      });

      // decrement stock
      for (const i of items) {
        await tx.product.update({
          where: { id: i.productId },
          data: { stock: { decrement: i.quantity } },
        });
      }

      return order;
    });

    res.status(201).json(created);
  } catch (e) { next(e); }
};

// GET /order/:id
exports.get = async (req, res, next) => {
  try {
    const row = await prisma.order.findUnique({
      where: { id: req.params.id },
      include: { items: true, user: { select: { id: true, email: true, firstName: true, lastName: true } } },
    });
    if (!row) return res.status(404).json({ error: "Not Found" });
    res.json(row);
  } catch (e) { next(e); }
};

// GET /order/user/:userId  (recent first)
exports.listForUser = async (req, res, next) => {
  try {
    const rows = await prisma.order.findMany({
      where: { userId: req.params.userId },
      orderBy: { createdAt: "desc" },
      include: { items: true },
    });
    res.json(rows);
  } catch (e) { next(e); }
};