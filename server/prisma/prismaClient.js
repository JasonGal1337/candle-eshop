const { PrismaClient } = require('../generated/prisma'); // or '@prisma/client' if default output
const prisma = new PrismaClient();
module.exports = prisma;