require("dotenv/config");

const bcrypt = require("bcrypt");
const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

async function main() {
  const email = "seed-user@example.com";
  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) {
    return;
  }

  const passwordHash = await bcrypt.hash("ChangeMe123!", 10);
  await prisma.user.create({
    data: {
      email,
      passwordHash,
      conversations: {
        create: {
          title: "Seed Conversation",
          messages: {
            create: [
              { role: "USER", content: "Generate BVA cases for login" },
              { role: "ASSISTANT", content: "Sure, here are sample BVA test cases." },
            ],
          },
        },
      },
    },
  });
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (error) => {
    console.error(error);
    await prisma.$disconnect();
    process.exit(1);
  });
