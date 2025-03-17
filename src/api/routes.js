import Router from 'koa-router';

import authRouter from './auth/routes.js';
import permissionsRouter from './permissions/routes.js';

const router = new Router();

router.get('/', async(ctx) => ctx.status = 200);

router.use(authRouter.routes());
router.use(permissionsRouter.routes());

export default router;
