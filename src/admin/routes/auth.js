import Router from 'koa-router';
import schema from '../schemas/auth.js';
import controller from '../controllers/auth.js';
import session from '../lib/session.js';

const router = new Router();

const basepath = '/admin/auth';

router.get(`${basepath}/login`, (ctx) => {
    if (session.get(ctx)) ctx.redirect('/admin');
    ctx.type = 'html';
    return ctx.render('auth/login', { registerSuccess: ctx.query.register === 'success' });
});

router.get(`${basepath}/register`, (ctx) => {
    if (session.get(ctx)) ctx.redirect('/admin');
    ctx.type = 'html';
    return ctx.render('auth/register');
});

router.post(`${basepath}/logout`, (ctx) => {
    session.destroy(ctx);
    return ctx.redirect(`${basepath}/login`);
});

router.post(`${basepath}/login`, async(ctx) => {
    // validation
    let strippedBody;
    try {
        await schema.login.validate(ctx.request.body, { stripUnknown: true, abortEarly: false })
            .then((value) => strippedBody = value);
    } catch (error) {
        const errors = {};
        error.inner.forEach((err) => errors[err.path] = err.message);
        return ctx.render('auth/login', { errors, values: ctx.request.body || {} });
    }

    try {
        const user = await controller.findOne({ email: strippedBody.email });
        const errMessage = 'Invalid email or password';
        if (!user) return ctx.render('auth/login', { errors: { message: errMessage }, values: ctx.request.body || {} });

        const { id, username, email, password } = user;

        const validPassword = await controller.validatePassword(strippedBody.password, password);
        if (!validPassword) return ctx.render('auth/login', { errors: { message: errMessage }, values: ctx.request.body || {} });

        session.create(ctx, { id, username, email });
        return ctx.redirect('/admin');

    } catch (error) {
        console.log(error);
        return new ApplicationError();
    }
});

router.post(`${basepath}/register`, async(ctx) => {

    // validation
    let strippedBody;
    try {
        await schema.register.validate(ctx.request.body, { stripUnknown: true, abortEarly: false })
            .then((value) => strippedBody = value);
    } catch (error) {
        const errors = {};
        error.inner.forEach((err) => errors[err.path] = err.message);
        return ctx.render('register', { errors, values: ctx.request.body || {} });
    }

    // create user
    try {
        const user = await controller.findOne({ email: strippedBody.email });

        if (user) {
            const errors = { email: 'email already in use' };
            return ctx.render('register', { errors, values: ctx.request.body || {} });
        }
        const registerdUser = await controller.register(strippedBody);
        if (registerdUser) ctx.redirect(`${basepath}/login?register=success`);

    } catch (error) {
        console.log(error);
        return new ApplicationError();
    }

});
export default router;
