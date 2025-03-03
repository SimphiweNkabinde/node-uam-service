import Router from 'koa-router';
const router = new Router();
import pug from 'pug';
import path from 'path';
import entityController from './controllers/entity.js';
import adminConfig from './admin.config.js';

// views
const __dirname = path.resolve();
const indexView = path.join(__dirname, '/src/admin/views/index.pug');
const notFoundView = path.join(__dirname, '/src/admin/views/not-found.pug');

const basePath = '/admin';

router.get(`${basePath}`, async(ctx) => {
    ctx.type = 'html';
    ctx.body = pug.renderFile(indexView, { entityNames: Object.keys(adminConfig.entities).filter((entity) => adminConfig.entities[entity].visible) });
});

router.get(`${basePath}/:entity`, async(ctx) => {
    const { entity } = ctx.params;
    if (!adminConfig.entities[entity] ||  !adminConfig.entities[entity].visible) {
        ctx.status = 404;
        ctx.type = 'html';
        return ctx.body = pug.renderFile(notFoundView);
    }
    const records = await entityController.getAll(entity);

    records.forEach((item) =>  {
        item.created_at = item.created_at.toISOString();
        item.updated_at = item.updated_at.toISOString();
    });

    ctx.type = 'html';
    ctx.body = pug.renderFile(indexView, {
        entityNames: Object.keys(adminConfig.entities).filter((entity) => adminConfig.entities[entity].visible),
        records,
        visibleFields: adminConfig.entities[entity].indexFields,
        ActiveEntityName: entity,
    });
});

export default router;
