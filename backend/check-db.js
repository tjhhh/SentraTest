const { Pool } = require("pg");
const { PrismaPg } = require("@prisma/adapter-pg");
const { PrismaClient } = require("@prisma/client");

const DATABASE_URL = "postgresql://postgres:postgres@localhost:5436/sentra_test?schema=public";

async function main() {
  const pool = new Pool({ connectionString: DATABASE_URL });
  const adapter = new PrismaPg(pool);
  const prisma = new PrismaClient({ adapter });

  const result = await prisma.testCase.findFirst({
    where: { conversationId: 'de772462-480d-4b54-89c1-bdc317c5304a' },
    orderBy: { createdAt: 'desc' },
  });
  console.log(JSON.stringify(result, null, 2));
  
  await prisma.$disconnect();
}

main()
  .catch(async (e) => {
    console.error(e);
    process.exit(1);
  });
