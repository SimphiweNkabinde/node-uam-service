import Router from 'koa-router';
import middlware from '../middlware.js';
import controller from '../controllers/permissions.js';
import schema from '../schemas/permissions.js';

const router = new Router();

const basepath = '/admin/permissions';

router.post(`${basepath}/create`, middlware.auth, async(ctx) => {

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

export default router;
