const Router = require('koa-router');
const hello = new Router();

hello.get('/', ctx => {
    ctx.body = 'Hello World'
})

module.exports = hello;