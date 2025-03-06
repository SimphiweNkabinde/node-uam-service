import session from '../utils/session.js';

export default {
    /**
     * Create a session and store it in cookies
     * @param {import('koa').Context} ctx Koa context
     * @param {Object} user payload
     */
    auth: (ctx, next) => {
        const user = session.get(ctx);
        if (!user) return ctx.redirect('/admin/auth/login');
        ctx.state.user = user;
        return next();
    },
};
