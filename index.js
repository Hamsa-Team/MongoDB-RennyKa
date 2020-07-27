const Koa = require('koa');
const mongo = require('koa-mongo')
const bcrypt = require('bcrypt');
const app = new Koa();
const Router = require('koa-router');
const router = new Router();
const bodyParser = require('koa-bodyparser');
const session = require('koa-session');
const fetch = require('node-fetch');
const env = require('dotenv').config();
fs = require('fs');
const employees = require('./router/employees');
const login = require('./router/login');
const logout = require('./router/logout');
const hello = require('./router/helloWorld');

app.use(mongo({
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    db: process.env.DB_NAME,

}));
app.use(bodyParser());
app.use(session(app));
app.keys = ['107']

app.use(router.routes()).use(employees.routes()).use(login.routes()).use(logout.routes()).use(hello.routes()).use(router.allowedMethods())
app.listen(3000);