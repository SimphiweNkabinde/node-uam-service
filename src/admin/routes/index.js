import Router from 'koa-router';

import authRouter from './auth.js';
import usersRouter from './users.js';
import servicesRouter from './services.js';
import groupsRouter from './groups.js';
import middlware from '../middlware.js';

const router = new Router();

router.get('/', async(ctx) => ctx.redirect('/admin'));
router.get('/admin', middlware.auth, (ctx) => ctx.render('index', { user: ctx.state.user }));

router.use(authRouter.routes());
router.use(usersRouter.routes());
router.use(servicesRouter.routes());
router.use(groupsRouter.routes());

export default router;
