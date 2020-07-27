const Router = require('koa-router');
const login = new Router();
const bcrypt = require('bcrypt');

login.post('/login', async ctx => {
    const req = ctx.request.body;
    const user = await ctx.db.collection('users').findOne({
        username: req.username,
    });
    const checkLogin = user ? await bcrypt.compareSync(req.password, user.password)
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
}).post('/signup', async ctx => {
    const password = await bcrypt.hash(ctx.request.body.password, 10);
    const user = await ctx.db.collection('users').findOne({
        username: ctx.request.body.username,
    });
    if (!user) {
        const result = await ctx.db.collection('users').insertOne({
            username: ctx.request.body.username,
            password: password
        });
        if (result) {
            ctx.body = 'Signup successfully!'
        } else {
            ctx.body = 'Signup fail!'
        }
    } else ctx.body = 'User already existed!'
})

module.exports = login;