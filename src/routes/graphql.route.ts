import Router from "koa-router";
import { Context, Next } from "koa"
import { Request, getGraphQLParameters, processRequest, sendResult, renderGraphiQL } from "graphql-helix";

import { schema } from "../schema";
import { contextFactory } from "../context";

const router = new Router();

router.post("/graphql", async (ctx: Context, next: Next) => {

    const request: Request = {
        headers: ctx.request.headers,
        method: ctx.request.method,
        query: ctx.request.query,
        body: ctx.request.body,
    }

    const { operationName, query, variables } = getGraphQLParameters(request);

    const result = await processRequest({
        request,
        schema,
        operationName,
        contextFactory: () => contextFactory(ctx.request),
        query,
        variables,
    });

    sendResult(result, ctx.res);
    next();

});

router.get("/graphql", async (ctx: Context, next: Next) => {

    ctx.response.type = 'text/html'
    ctx.response.body = renderGraphiQL({ endpoint: 'graphql' })
    ctx.response.status = 200;

    next();
})

export default router;