const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

const connectDB = async () => {
  try {
    await prisma.$connect();
    console.log("✅ Prisma connected to database");
  } catch (error) {
    console.error("❌ Prisma Database Connection Error:", error.message);
    process.exit(1);
  }
};

module.exports = { prisma, connectDB };
