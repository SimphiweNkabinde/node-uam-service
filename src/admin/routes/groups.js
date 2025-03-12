import Router from 'koa-router';
import middlware from '../middlware.js';
import controller from '../controllers/groups.js';
import schema from '../schemas/groups.js';

const router = new Router();

const basepath = '/admin/groups';

router.get(basepath, middlware.auth, async(ctx) => {
    const records = await controller.findAll();

    ctx.type = 'html';
    return ctx.render('groups', { records, user: ctx.state.user });
});

router.get(`${basepath}/create`, middlware.auth, async(ctx) => {
    console.log(ctx.state);

    ctx.type = 'html';
    return ctx.render('groups/create', { user: ctx.state.user, values: {} });
});

router.get(`${basepath}/:id`, middlware.auth, async(ctx) => {
    const { id } = ctx.params;
    const record = await controller.findOne({ id });
    ctx.type = 'html';
    return ctx.render('services/id', { record, user: ctx.state.user });
});

router.post(`${basepath}/create`, middlware.auth, async(ctx) => {

    let strippedBody;
    try {
        await schema.create.validate(ctx.request.body, { stripUnknown: true, abortEarly: false })
            .then((value) => strippedBody = value);
    } catch (error) {
        const errors = {};
        error.inner.forEach((err) => errors[err.path] = err.message);
        return ctx.render('groups/create', { errors, values: ctx.request.body || {}, params: ctx.params });
    }

    const record = await controller.create(strippedBody);
    return ctx.redirect(`/admin/groups/${record.id}`);
});

export default router;
