const regeneratorRuntime = require('babel-runtime/regenerator');
import Koa from 'koa';
import Router from 'koa-router';
import convert from 'koa-convert';
import graphqlHTTP from 'koa-graphql';
import schema from './schema';

const app = new Koa();
const router = new Router();

app
  .use(async (ctx, next) => {
    const start = Date.now();
    await next();
    ctx.set('X-Response-Time', `${Date.now() - start}ms`);
  });

router.all('/graphql', convert(graphqlHTTP({
  schema,
  graphiql: true,
})));

app.use(router.routes()).use(router.allowedMethods());

app.listen(3000, () => {
  console.log('Listening');
});