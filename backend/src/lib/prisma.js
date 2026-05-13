const { PrismaClient } = require("@prisma/client");
const { PrismaPg } = require("@prisma/adapter-pg");
const { Pool } = require("pg");

// Mengambil variabel DATABASE_URL dari .env
const connectionString = process.env.DATABASE_URL;

// Membuat pool koneksi PostgreSQL
const pool = new Pool({ connectionString });

// Membuat adapter untuk Prisma
const adapter = new PrismaPg(pool);

// Inisialisasi Prisma Client dengan adapter tersebut
const prisma = new PrismaClient({ adapter });

module.exports = prisma;