const Router = require('koa-router');
const logout = new Router();

logout.get('/logout', ctx => {
    ctx.session = null;
    ctx.redirect('/')
})

module.exports = logout;