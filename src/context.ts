import { PrismaClient, User } from "@prisma/client"
import { authenticateUser } from "./auth";
import { Request } from "koa";

const prisma = new PrismaClient();

//TypeScript type GraphQLContext will represent the structure of the GraphQL context
export type GrapQLContext = {
    prisma: PrismaClient;
    currentUser: User | null;
};

export async function contextFactory(request: Request): Promise<GrapQLContext> {
    return {
        prisma,
        currentUser: await authenticateUser(prisma, request)
    };
};
