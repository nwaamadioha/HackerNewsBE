import "graphql-import-node"
import Koa from "koa"
import graphqlRoute from "./routes/graphql.route"
import bodyParser from "koa-bodyparser";

async function main() {
    const app = new Koa();

    app.use(bodyParser());
    app.use(graphqlRoute.routes());

    const port = 3647;

    app.listen(port, () => {
        console.log(`Koa app listening on http://localhost:${port}`)
    })
}

main();

