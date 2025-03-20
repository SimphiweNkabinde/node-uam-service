// set environment
import * as dotenv from 'dotenv';
dotenv.config({ path: `.env.${process.env.NODE_ENV || 'development'}` });
import cors from '@koa/cors';

import Koa from 'koa';
import bodyParser from 'koa-bodyparser';
import { ApplicationError } from './utils/errors.js';
import Pug from 'koa-pug';
import path from 'path';
import override from 'koa-override';
import serve from 'koa-static';

// routers
import adminRouter from './admin/routes/index.js';
import apiRouter from './api/routes.js';
import viewLocals from './admin/view.locals.js';
const __dirname = path.resolve();

const app = new Koa();

app.use(cors());

// serve static files
app.use(serve(path.join(__dirname, '/src/admin/public')));

new Pug({
    viewPath: path.resolve(__dirname, './src/admin/views'),
    locals: { ...viewLocals },
    app,
});


// setup error handling middleware
app.use(async(ctx, next) => {
    ApplicationError.setContext(ctx);
    await next();
});

app.use(bodyParser());
app.use(override());
//  routes
app.use(adminRouter.routes());
app.use(apiRouter.routes());

app.listen(process.env.PORT, () => {
    console.log(`Server listening on port: ${process.env.PORT}`);
});

export default app;
