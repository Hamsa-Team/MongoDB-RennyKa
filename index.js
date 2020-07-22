const Koa = require('koa');
const mongo = require('koa-mongo')
const bcrypt = require('bcrypt');
const app = new Koa();
const Router = require('koa-router');
const router = new Router();
const bodyParser = require('koa-bodyparser');
const session = require('koa-session');
const fetch = require('node-fetch');
fs = require('fs')

app.use(mongo({
    host: 'localhost',
    port: 27017,
    db: 'training-mongo',

}));
app.use(bodyParser());
app.use(session(app));
app.keys = ['107']

async function crawlData(ctx) {
    let data = fs.readFileSync('employees.json', 'utf8')
    const result = await ctx.db.collection('employees').insertMany(JSON.parse(data));
    return result ? true : false;
}

function verifyLogin(ctx, next) {
    if (!ctx.session.user) {
        ctx.status = 403;
        ctx.body = "Fobidden"
    } else {
        return next()
    }
}

router.use(['/employees', '/employees/crawl'], verifyLogin)

router.get('/', ctx => {
    ctx.body = 'Hello World'
}).post('/login', async ctx => {
    const req = ctx.request.body;
    const user = await ctx.db.collection('users').find({
        username: req.username,
    }).toArray();
    const checkLogin = user[0] ? await bcrypt.compareSync(req.password, user[0].password)
        : false;
    if (checkLogin) {
        ctx.session.user = {
            username: req.username,
        }
        ctx.body = `Welcome ${req.username}`
    } else {
        ctx.status = 401;
        ctx.body = 'Unauthorized'
    }
}).get('/logout', ctx => {
    ctx.session = null;
    ctx.redirect('/')
}).post('/employees/crawl', async ctx => {
    if (crawlData(ctx)) {
        ctx.body = "Crawl data successfully!"
    } else ctx.body = "Crawl data fail!";
}).get('/employees', async ctx => {
    const data = await ctx.db.collection('employees').find({}).toArray();
    ctx.body = data
}).post('/signup', async ctx => {
    const password = await bcrypt.hash(ctx.request.body.password, 10);
    const result = await ctx.db.collection('users').insertOne({
        username: ctx.request.body.username,
        password: password
    });
    if (result) {
        ctx.body = 'Signup successfully!'
    } else {
        ctx.body = 'Signup fail!'
    }
}).get('/employees/:name', async ctx => {
    const name = ctx.params.name;
    const result = name ? await ctx.db.collection('employees').find({
        employee_name: name
    }).toArray() : null
    ctx.body = result;
})



app.use(router.routes()).use(router.allowedMethods())
app.listen(3000);