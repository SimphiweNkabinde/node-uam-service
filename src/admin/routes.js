import Router from 'koa-router';
const router = new Router();
import entityController from './controllers/entity.js';
import locals from '../utils/locals.js';

const basepath = '/admin';

router.get(basepath, async(ctx) => ctx.render('index'));

router.get(`${basepath}/auth/login`, async(ctx) => {
    ctx.type = 'html';
    return ctx.render('login');
});

router.post(`${basepath}/auth/login`, async(ctx) => {
    ctx.type = 'html';
    return ctx.render('login');
});

router.get(`${basepath}/:entity`, async(ctx) => {
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
    return ctx.render('index', { records, params: ctx.params });
});

export default router;
