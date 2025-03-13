import Router from 'koa-router';
import middlware from '../middlware.js';
import controller from '../controllers/groups.js';
import schema from '../schemas/groups.js';
import permissionsController from '../controllers/permissions.js';

const router = new Router();

const basepath = '/admin/groups';

router.get(basepath, middlware.auth, async(ctx) => {
    const records = await controller.findAll();

    ctx.type = 'html';
    return ctx.render('groups', { records, user: ctx.state.user });
});

router.get(`${basepath}/create`, middlware.auth, async(ctx) => {
    ctx.type = 'html';
    return ctx.render('groups/create', { user: ctx.state.user, values: {} });
});

router.get(`${basepath}/:id`, middlware.auth, async(ctx) => {
    const { id } = ctx.params;
    const record = await controller.findOne({ id });

    if (!record) return ctx.render('not-found');

    const permissions = await permissionsController.findAll();
    ctx.type = 'html';
    return ctx.render('groups/id', { record, permissions, user: ctx.state.user });
});

router.post(basepath, middlware.auth, async(ctx) => {

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

router.put(`${basepath}/:id`, middlware.auth, async(ctx) => {
    const { id } = ctx.params;

    let strippedBody;
    try {
        await schema.update.validate(ctx.request.body, { stripUnknown: true, abortEarly: false })
            .then((value) => strippedBody = value);
    } catch (error) {
        const errors = {};
        error.inner.forEach((err) => errors[err.path] = err.message);
        return ctx.render('services', { errors, values: ctx.request.body || {}, params: ctx.params });
    }

    await controller.update(id, strippedBody);

    return ctx.redirect(`/admin/groups/${id}`);
});

router.delete(`${basepath}/:id`, middlware.auth, async(ctx) => {
    const { id } = ctx.params;
    await controller.remove(id);
    return ctx.redirect('/admin/groups');
});

export default router;
