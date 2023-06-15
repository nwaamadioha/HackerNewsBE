import { makeExecutableSchema } from "@graphql-tools/schema";
import { hash, compare } from "bcryptjs";
import { sign } from "jsonwebtoken";

import { Link, User } from "@prisma/client"
import typeDefs from "./schema.graphql"
import { GrapQLContext } from "./context";
import { APP_SECRET } from "./auth";


const resolvers = {
    Query: {
        info: () => "This is the API clone for hacker news website",
        feed: async (parent: unknown, args: {}, context: GrapQLContext) => {
            return await context.prisma.link.findMany();
        },
        me: (parent: unknown, args: {}, context: GrapQLContext) => {
            if (context.currentUser === null) {
                throw new Error("Unauthenticated");
            }
            return context.currentUser;
        },
    },
    Mutation: {
        post: async (parent: unknown, args: { description: string, url: string }, context: GrapQLContext) => {

            if (context.currentUser === null) {
                throw new Error("Unauthenticated!");
            }
            const { description, url } = args;

            const link = await context.prisma.link.create({
                data: {
                    description: description,
                    url: url,
                    postedBy: { connect: { id: context.currentUser.id } },
                },
            });

            return link;
        },
        signup: async (parent: unknown, args: { email: string, name: string, password: string }, context: GrapQLContext) => {
            const { email, name } = args;
            const password = await hash(args.password, 10)
            const user = await context.prisma.user.create({
                data: {
                    name: name,
                    email: email,
                    password: password
                }
            });

            const token = sign({ userId: user.id }, APP_SECRET);

            return { user, token }

        },
        login: async (parent: unknown, args: { email: string, password: string }, context: GrapQLContext) => {
            const user = await context.prisma.user.findUnique({
                where: { email: args.email }
            });

            if (!user) {
                throw new Error("No such user")
            }

            const valid = await compare(args.password, user.password)

            if (!valid) {
                throw new Error("Invalid password")
            }

            const token = sign({ userId: user.id }, APP_SECRET)

            return { user, token }
        }
    },
    Link: { 
        postedBy: async (parent: Link, args: {}, context: GrapQLContext) => {
            if (!parent.postedById) {
                return null;
            }

            return await context.prisma.link
                .findUnique({ where: { id: parent.id } })
                .postedBy();
        },
    },
    User: {
        links: async (parent: User, args: {}, context: GrapQLContext) => {
            return await context.prisma.user.findUnique({ where: { id: parent.id}}).links();
        }
    },
}

export const schema = makeExecutableSchema({
    typeDefs,
    resolvers,
});

