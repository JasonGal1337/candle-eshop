const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const prisma = require("../prisma/prismaClient");

const JWT_SECRET = process.env.JWT_SECRET;

/**
 * POST /user/signup
 * body: { email, password, name, surname, address, zip, addedToCart, boughtBefore }
 *
 * NOTE:
 * - In Prisma we typically store password as passwordHash.
 * - Your new schema likely uses firstName / lastName and does NOT keep address on User.
 *   We map name -> firstName, surname -> lastName. Adjust as your schema dictates.
 */
const signup = async (req, res) => {
  try {
    const checkUser = await prisma.user.findUnique({
      where: { email: req.body.email },
      select: { id: true },
    });

    if (checkUser) {
      return res.send({ msg: "email already exists" });
    }

    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(req.body.password, salt);

    const user = {
      email: req.body.email,
      passwordHash: hash,
      // Map your old fields to new schema fields:
      firstName: req.body.name,     // old "name"
      lastName: req.body.surname,   // old "surname"
      // If your Prisma User has different columns, adjust here.
      // If you still store extra flags, include them only if columns exist.
      // addedToCart: req.body.addedToCart, // include only if you created this column
      // boughtBefore: req.body.boughtBefore,
      // address/zip usually move to ORDER snapshot or ADDRESS table, not the User.
    };

    const createdUser = await prisma.user.create({
      data: user,
      select: { id: true }, // we only need id for token
    });

    const token = jwt.sign({ id: createdUser.id }, JWT_SECRET);
    res.send({ token });
  } catch (err) {
    console.error(err);
    res.status(500).send({ msg: "Server error" });
  }
};

/**
 * POST /user/login
 * body: { email, password }
 */
const login = async (req, res) => {
  try {
    const user = await prisma.user.findUnique({
      where: { email: req.body.email },
    });

    if (!user) {
      return res.send({ msg: "wrong email" });
    }

    const result = await bcrypt.compare(req.body.password, user.passwordHash);
    if (result) {
      const token = jwt.sign({ id: user.id }, JWT_SECRET);
      return res.send({ token });
    } else {
      return res.send({ msg: "wrong password" });
    }
  } catch (err) {
    console.error(err);
    res.status(500).send({ msg: "Server error" });
  }
};

/**
 * POST /user/verify
 * body: { token }
 */
const verify = async (req, res) => {
  if (!req.body.token) {
    return res.send({ msg: false });
  }

  try {
    const payload = jwt.verify(req.body.token, JWT_SECRET);
    if (!payload) return res.send("Invalid Token");

    const user = await prisma.user.findUnique({ where: { id: payload.id } });
    if (!user) return res.send("Invalid Token");

    const token = jwt.sign({ id: user.id }, JWT_SECRET); // re-issue token

    // Return user data (avoid passwordHash)
    const { passwordHash, ...userData } = user;
    res.send({
      userData,
      token,
    });
  } catch (err) {
    return res.send("Invalid Token");
  }
};

/**
 * POST /user/editInfo
 * body: { token, name?, surname? }
 *
 * NOTE:
 * - Old code updated address/zip/boughtBefore/addedToCart directly on User.
 *   In the new SQL design, keep User minimal; address lives per ORDER or in ADDRESS table.
 * - Here we only update firstName/lastName to match the streamlined schema.
 */
const editInfo = async (req, res) => {
  if (!req.body.token) {
    return res.send({ msg: "Token is missing" });
  }

  try {
    const payload = jwt.verify(req.body.token, JWT_SECRET);
    if (!payload) return res.send("Invalid Token");

    const userId = payload.id;

    const updatedData = {
      // Map old fields to new ones (only include if provided)
      ...(req.body.name ? { firstName: req.body.name } : {}),
      ...(req.body.surname ? { lastName: req.body.surname } : {}),
      // If you later decide to keep more profile fields in User, add them here.
    };

    const user = await prisma.user.update({
      where: { id: userId },
      data: updatedData,
    });

    const token = jwt.sign({ id: user.id }, JWT_SECRET);
    const { passwordHash, ...userData } = user;
    res.send({
      userData,
      token,
    });
  } catch (err) {
    return res.send("Invalid Token");
  }
};

/**
 * POST /user/getUserInfo
 * body: { token }
 */
const getUserInfo = async (req, res) => {
  if (!req.body.token) {
    return res.send({ msg: "Token is missing" });
  }

  try {
    const payload = jwt.verify(req.body.token, JWT_SECRET);
    if (!payload) return res.send("Invalid Token");

    const user = await prisma.user.findUnique({ where: { id: payload.id } });
    if (!user) return res.send("User not found");

    const { passwordHash, ...userData } = user;
    res.send({ userData });
  } catch (err) {
    return res.send("Invalid Token");
  }
};

module.exports = {
  signup,
  login,
  verify,
  editInfo,
  getUserInfo,
};