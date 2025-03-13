import Router from 'koa-router';
import middlware from '../middlware.js';
import controller from '../controllers/users.js';
import permissionsController from '../controllers/permissions.js';
const router = new Router();

const basepath = '/admin/users';

router.get(basepath, middlware.auth, async(ctx) => {
    const records = await controller.findAll();

    ctx.type = 'html';
    return ctx.render('users', { records, user: ctx.state.user });
});

router.get(`${basepath}/:id`, middlware.auth, async(ctx) => {
    const { id } = ctx.params;
    const record = await controller.findOne({ id });

    if (!record) return ctx.render('not-found');

    const permissions = await permissionsController.findAll();
    ctx.type = 'html';
    return ctx.render('users/id', { record, permissions, user: ctx.state.user });
});

export default router;
