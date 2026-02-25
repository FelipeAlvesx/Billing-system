import { PrismaClient } from '@prisma/client';
import { PrismaPostgresAdapter } from '@prisma/adapter-ppg'

const connectionString = `${process.env.DATABASE_URL}`;
const adapter = new PrismaPostgresAdapter({ connectionString })

export const prisma = new PrismaClient({ adapter });
