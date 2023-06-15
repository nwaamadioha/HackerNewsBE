import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient();

async function main() {//handles all queries to be sent to the database

    const allLinks = await prisma.link.findMany();
};

main().catch(e => {
    throw e
}).finally(async () => {//close the database connection once the script terminates
    await prisma.$disconnect()
})