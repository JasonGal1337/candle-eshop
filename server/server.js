require("dotenv").config();

const express = require("express");
const cors = require("cors");
const helmet = require("helmet");

const app = express();

// Prisma client for graceful shutdown
const prisma = require("./prisma/prismaClient.js");

// Routers
const userRouter = require("./routers/userRouter");
const adminRouter = require("./routers/adminRouter");
const categoryRouter = require("./routers/categoryRouter");
const productRouter = require("./routers/productRouter");
const productCategoryRouter = require("./routers/productCategoryRouter");
const productImageRouter = require("./routers/productImageRouter");
const addressRouter = require("./routers/addressRouter");
const reviewRouter = require("./routers/reviewRouter");
const orderRouter = require("./routers/orderRouter");
const orderItemRouter = require("./routers/orderItemRouter");
const cartRouter = require("./routers/cartRouter");
const cartItemRouter = require("./routers/cartItemRouter");

// Custom middlewares
const notFound = require("./middlewares/notFound");
const errorHandler = require("./middlewares/errorHandler");

// -------- Core middleware --------
app.use(
  helmet({
    // If I ever serve images/files from another origin, disable CORP:
    // crossOriginResourcePolicy: { policy: "cross-origin" },
  })
);

// Parse JSON & URL-encoded bodies
app.use(express.json({ limit: "1mb" }));
app.use(express.urlencoded({ extended: true }));

// CORS 
app.use(
  cors({
    origin: process.env.CORS_ORIGIN || "*", // e.g., "http://localhost:5173" or "https://yourdomain.com"
    credentials: true, // set true if you use cookies for auth
  })
);

// -------- Health check --------
app.get("/health", (_req, res) => res.json({ ok: true }));

// -------- Routes --------
app.use("/user", userRouter);
app.use("/admin", adminRouter);
app.use("/category", categoryRouter);
app.use("/product", productRouter);
app.use("/productCategory", productCategoryRouter);
app.use("/productImage", productImageRouter);
app.use("/address", addressRouter);
app.use("/review", reviewRouter);
app.use("/order", orderRouter);
app.use("/orderItem", orderItemRouter);
app.use("/cart", cartRouter);
app.use("/cartItem", cartItemRouter);

// -------- 404 + Error handling --------
app.use(notFound);         // uniform JSON 404 for unknown routes
app.use(errorHandler);     // centralized error formatter

// -------- Start server + graceful shutdown --------
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