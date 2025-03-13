import Router from 'koa-router';
import middlware from '../middlware.js';
import controller from '../controllers/permissions.js';
import schema from '../schemas/permissions.js';

const router = new Router();

const basepath = '/admin/permissions';

router.post(basepath, middlware.auth, async(ctx) => {

    let strippedBody;
    try {
        await schema.create.validate(ctx.request.body, { stripUnknown: true, abortEarly: false })
            .then((value) => strippedBody = value);
    } catch (error) {
        const errors = {};
        error.inner.forEach((err) => errors[err.path] = err.message);
        return ctx.render('services/create', { errors, values: ctx.request.body || {}, params: ctx.params });
    }

    await controller.create(strippedBody);

    return ctx.redirect(`/admin/services/${strippedBody.serviceId}`);
});

router.delete(`${basepath}/:serviceId/:permissionId`, middlware.auth, async(ctx) => {
    const { serviceId, permissionId } = ctx.params;
    await controller.remove(permissionId);
    return ctx.redirect(`/admin/services/${serviceId}`);
});


router.post(`${basepath}-user`, middlware.auth, async(ctx) => {

    let strippedBody;
    try {
        await schema.assignUser.validate(ctx.request.body, { stripUnknown: true, abortEarly: false })
            .then((value) => strippedBody = value);
    } catch (error) {
        const errors = {};
        error.inner.forEach((err) => errors[err.path] = err.message);
        return ctx.render('services/id', { errors, values: ctx.request.body || {}, params: ctx.params });
    }

    await controller.assignToUser(strippedBody);

    return ctx.redirect(`/admin/users/${strippedBody.userId}`);
});

router.post(`${basepath}-group`, middlware.auth, async(ctx) => {

    let strippedBody;
    try {
        await schema.assignGroup.validate(ctx.request.body, { stripUnknown: true, abortEarly: false })
            .then((value) => strippedBody = value);
    } catch (error) {
        const errors = {};
        error.inner.forEach((err) => errors[err.path] = err.message);
        console.log(errors);
        return ctx.redirect(`/admin/groups/${ctx.request.body.groupId}`);
    }

    await controller.assignToGroup(strippedBody);

    return ctx.redirect(`/admin/groups/${strippedBody.groupId}`);
});

export default router;
