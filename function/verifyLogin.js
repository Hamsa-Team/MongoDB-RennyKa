module.exports = function verifyLogin(ctx, next) {
    if (!ctx.session.user) {
        ctx.status = 403;
        ctx.body = "Fobidden"
    } else {
        return next()
    }
}