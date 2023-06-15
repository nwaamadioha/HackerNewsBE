import { PrismaClient, User } from "@prisma/client";
import { Request } from "koa";
import { JwtPayload, verify } from "jsonwebtoken";

export const APP_SECRET = "9js-n02m)3j0s-20sd0£n30"

export async function authenticateUser(prisma: PrismaClient, request: Request): Promise<User | null> {
    if (request?.headers?.authorization) {
        const token = request.headers.authorization.replace("Bearer ", "");
        if (!token) {
            throw new Error("Token not found");
        }
        const tokenPayload = verify(token, APP_SECRET) as JwtPayload
        const userId = tokenPayload.userId

        return await prisma.user.findUnique({ where: { id: userId } });
    }

    return null;
}