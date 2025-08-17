const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const prisma = require("../prisma/prismaClient");

const JWT_SECRET = process.env.JWT_SECRET;

/**
 * POST /admin/signup
 * body: { email, password, username, isAdmin }
 */
const signup = async (req, res) => {
  try {
    const { email, password, username, isAdmin } = req.body;

    // check existing admin by email
    const checkAdmin = await prisma.admin.findUnique({ where: { email } });
    if (checkAdmin) {
      return res.send({ msg: "email already exists" });
    }

    // NOTE: Prisma Admin model typically uses passwordHash (not password)
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(password, salt);

    const createdAdmin = await prisma.admin.create({
      data: {
        email,
        username,
        ...(typeof isAdmin !== "undefined" ? { isAdmin: !!isAdmin } : {}),
        passwordHash: hash,
      },
    });

    const token = jwt.sign({ id: createdAdmin.id }, JWT_SECRET);
    res.send({ token });
  } catch (err) {
    console.error(err);
    res.status(500).send({ msg: "Server error" });
  }
};

/**
 * POST /admin/login
 * body: { username, password }
 */
const login = async (req, res) => {
  try {
    const { username, password } = req.body;

    // Find admin by username
    const admin = await prisma.admin.findUnique({ where: { username } });

    if (!admin) {
      return res.send({ msg: "wrong username" });
    }

    const result = await bcrypt.compare(password, admin.passwordHash);

    // Old logic also checked admin.isAdmin === true.
    // If your Admin model doesn't have isAdmin, just rely on existence in the Admin table.
    // If you kept isAdmin, uncomment the check below:
    // if (result && admin.isAdmin === true) {
    if (result) {
      const token = jwt.sign({ id: admin.id }, JWT_SECRET);
      return res.send({ token });
    } else {
      return res.send({ msg: "wrong password or isAdmin" });
    }
  } catch (err) {
    console.error(err);
    res.status(500).send({ msg: "Server error" });
  }
};

/**
 * POST /admin/verify
 * body: { token }
 */
const verify = async (req, res) => {
  if (!req.body.token) {
    return res.send({ msg: false });
  }

  try {
    const payload = jwt.verify(req.body.token, JWT_SECRET);
    if (!payload) return res.send("Invalid Token");

    const admin = await prisma.admin.findUnique({ where: { id: payload.id } });
    if (!admin) return res.send("Invalid Token");

    const token = jwt.sign({ id: admin.id }, JWT_SECRET); // issue new token
    // Send back admin data (avoid returning passwordHash)
    const { passwordHash, ...adminData } = admin;
    res.send({
      adminData,
      token,
    });
  } catch (err) {
    return res.send("Invalid Token");
  }
};

module.exports = {
  signup,
  login,
  verify,
};