const Router = require('koa-router');
const employees = new Router();
const crawlData = require('../function/crawl');
const verifyLogin = require('../function/verifyLogin');

employees.prefix('/employees');
employees.use(verifyLogin);

employees.post('/crawl', async ctx => {
    if (crawlData(ctx)) {
        ctx.body = "Crawl data successfully!"
    } else ctx.body = "Crawl data fail!";
})
employees.get('/', async ctx => {
    const data = await ctx.db.collection('employees').find({}).toArray();
    ctx.body = data
})
employees.get('/:name', async ctx => {
    const name = ctx.params.name;
    const result = name ? await ctx.db.collection('employees').find({
        employee_name: name
    }).toArray() : null
    ctx.body = result;
})

module.exports = employees;