// set environment
import * as dotenv from 'dotenv';
dotenv.config({ path: `.env.${process.env.NODE_ENV || 'development'}` });

import Koa from 'koa';
import bodyParser from 'koa-bodyparser';
import { ApplicationError } from './utils/errors.js';
import Pug from 'koa-pug';
import path from 'path';

const app = new Koa();

// routes
import authApiRoutes from './api/auth/routes.js';
import adminRoutes from './admin/routes.js';
import locals from './utils/locals.js';
const __dirname = path.resolve();

new Pug({
    viewPath: path.resolve(__dirname, './src/admin/views'),
    locals,
    app,
});

// setup error handling middleware
app.use(async(ctx, next) => {
    ApplicationError.setContext(ctx);
    await next();
});
app.use(bodyParser());
app.use(adminRoutes.routes());
app.use(authApiRoutes.routes());

app.listen(process.env.PORT, () => {
    console.log(`Server listening on port: ${process.env.PORT}`);
});

export default app;
