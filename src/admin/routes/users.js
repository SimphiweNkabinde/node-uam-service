import Router from 'koa-router';
import middlware from '../middlware.js';
import controller from '../controllers/users.js';
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
    ctx.type = 'html';
    return ctx.render('users/id', { record, user: ctx.state.user });
});

export default router;
