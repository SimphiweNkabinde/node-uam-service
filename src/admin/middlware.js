import session from './lib/session.js';

export default {
    auth: (ctx, next) => {
        const user = session.get(ctx);
        if (!user) return ctx.redirect('/admin/auth/login');
        ctx.state.user = user;
        return next();
    },
};
