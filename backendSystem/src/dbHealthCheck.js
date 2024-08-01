// testConnection.js

const { PrismaClient } = require("@prisma/client");

async function main() {
  const prisma = new PrismaClient();

  try {
    await prisma.$connect();
    console.log("Connected to the database.");
  } catch (error) {
    console.error("Unable to connect to the database:", error);
  } finally {
    await prisma.$disconnect();
  }
}

main();
