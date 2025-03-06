import Router from 'koa-router';
const router = new Router();
import entityController from './controllers/entity.js';
import locals from '../utils/locals.js';
import { login as loginSchema, register as registerSchema } from './../api/auth/schemas.js';
import authController from './controllers/authentication.js';
import session from '../utils/session.js';
import middlware from './middlware.js';

router.get('/', async(ctx) => ctx.redirect('/admin'));
router.get('/admin', middlware.auth, (ctx) => ctx.render('index', { user: ctx.state.user }));

router.get('/admin/auth/login', (ctx) => {
    if (session.get(ctx)) ctx.redirect('/admin');
    ctx.type = 'html';
    return ctx.render('auth/login', { registerSuccess: ctx.query.register === 'success' });
});

router.get('/admin/auth/register', (ctx) => {
    if (session.get(ctx)) ctx.redirect('/admin');
    ctx.type = 'html';
    return ctx.render('auth/register');
});

router.post('/admin/auth/logout', (ctx) => {
    session.destroy(ctx);
    return ctx.redirect('/admin/auth/login');
});

router.post('/admin/auth/login', async(ctx) => {
    // validation
    let strippedBody;
    try {
        await loginSchema.validate(ctx.request.body, { stripUnknown: true, abortEarly: false })
            .then((value) => strippedBody = value);
    } catch (error) {
        const errors = {};
        error.inner.forEach((err) => errors[err.path] = err.message);
        return ctx.render('auth/login', { errors, values: ctx.request.body });
    }

    try {
        const user = await authController.findOne({ email: strippedBody.email });
        const errMessage = 'Invalid email or password';
        if (!user) return ctx.render('auth/login', { errors: { message: errMessage }, values: ctx.request.body });

        const { id, username, email, password } = user;

        const validPassword = await authController.validatePassword(strippedBody.password, password);
        if (!validPassword) return ctx.render('auth/login', { errors: { message: errMessage }, values: ctx.request.body });

        session.create(ctx, { id, username, email });
        return ctx.redirect('/admin');

    } catch (error) {
        console.log(error);
        return new ApplicationError();
    }
});


router.post('/admin/auth/register', async(ctx) => {

    // validation
    let strippedBody;
    try {
        await registerSchema.validate(ctx.request.body, { stripUnknown: true, abortEarly: false })
            .then((value) => strippedBody = value);
    } catch (error) {
        const errors = {};
        error.inner.forEach((err) => errors[err.path] = err.message);
        return ctx.render('register', { errors, values: ctx.request.body });
    }

    // create user
    try {
        const user = await authController.findOne({ email: strippedBody.email });

        if (user) {
            const errors = { email: 'email already in use' };
            return ctx.render('register', { errors, values: ctx.request.body });
        }
        const registerdUser = await authController.register(strippedBody);
        if (registerdUser) ctx.redirect('/admin/auth/login?register=success');

    } catch (error) {
        console.log(error);
        return new ApplicationError();
    }

});

router.get('/admin/entity/:entity', middlware.auth, async(ctx) => {
    const { entity } = ctx.params;
    const targetEntity = locals.entities.find((val) => val.name === entity);
    if (!targetEntity ||  !targetEntity.active) {
        ctx.type = 'html';
        return ctx.render('not-found', { message: 'Entity Not Found' });
    }
    const records = await entityController.getAll(entity);

    records.forEach((item) =>  {
        item.created_at = item.created_at.toISOString();
        item.updated_at = item.updated_at.toISOString();
    });

    ctx.type = 'html';
    return ctx.render('entity', { records, params: ctx.params, user: ctx.state.user });
});

export default router;
