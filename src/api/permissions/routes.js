import Router from 'koa-router';
const router = new Router();
import controller from './controller.js';
import middleware from '../middleware.js';


const basepath = '/api/permissions';

router.get(basepath, middleware.auth, async(ctx) => {

    const permissions = await controller.getServicePermissions(ctx.state.user.id, ctx.state.service.id);

    ctx.status = 200;
    ctx.body = { data: permissions };

});

export default router;
