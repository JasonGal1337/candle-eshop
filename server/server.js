require("dotenv").config();
const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const app = express();



const prisma = require("./prisma/prismaClient.js");

// Routers
const userRouter = require("./routers/userRouter");
const adminRouter = require("./routers/adminRouter");
const productRouter = require("./routers/productRouter");
const productCategoryRouter = require("./routers/productCategoryRouter");
const productImageRouter = require("./routers/productImageRouter");
const addressRouter = require("./routers/addressRouter");
const reviewRouter = require("./routers/reviewRouter");
const orderRouter = require("./routers/orderRouter");
const orderItemRouter = require("./routers/orderItemRouter");
const cartRouter = require("./routers/cartRouter");
const cartItemRouter = require("./routers/cartItemRouter");

// Core middleware
app.use(helmet());

app.use(express.json({ limit: "1mb" }));

app.use(
  cors({
    origin: process.env.CORS_ORIGIN || "*", // tighten in prod
  })
);

// Health check
app.get("/health", (req, res) => res.json({ ok: true }));

// Mount routes 
app.use("/user", userRouter);
app.use("/admin", adminRouter);
app.use("/product", productRouter);
app.use("/productCategory", productCategoryRouter);
app.use("/productImage", productImageRouter);
app.use("/address", addressRouter);
app.use("/review", reviewRouter);
app.use("/order", orderRouter);
app.use("/orderItem", orderItemRouter);
app.use("/cart", cartRouter);
app.use("/cartItem", cartItemRouter);

// 404
app.use((req, res) => res.status(404).json({ error: "Not Found" }));

// Centralized error handler
app.use((err, _req, res, _next) => {
  console.error(err);
  const status = err.status || 500;
  res.status(status).json({
    error: err.name || "Error",
    message: err.message || "Internal Server Error",
  });
});

// Start server + graceful shutdown
const PORT = process.env.PORT || 4010;
const server = app.listen(PORT, () => {
  console.log(`server is running on port ${PORT}`);
});

const shutdown = async () => {
  console.log("Shutting down...");
  try {
    await prisma.$disconnect();
  } catch (_) {}
  server.close(() => process.exit(0));
};

process.on("SIGINT", shutdown);
process.on("SIGTERM", shutdown);

module.exports = app;