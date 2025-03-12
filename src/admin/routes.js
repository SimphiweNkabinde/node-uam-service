import Router from 'koa-router';
const router = new Router();
import entityController from './controllers/entity.js';
import locals from '../utils/locals.js';
import middlware from './middlware.js';

router.get('/admin/entity/:entity/:id', middlware.auth, async(ctx) => {
    const { entity, id } = ctx.params;

    if (id === 'create' || id === 'edit') {
        return ctx.render(`entity/${id}`, { params: ctx.params, user: ctx.state.user, values: {}, errors: {} });
    }

    const entitySettings = locals.entities.find((val) => val.name.plural  === entity);
    if (!entitySettings ||  !entitySettings.active) {
        ctx.type = 'html';
        return ctx.render('entity/not-found', { message: 'Entity Not Found', user: ctx.state.user });
    }
    const record = await entityController.findOne(entitySettings, { id });

    if (!record) return ctx.render('entity/not-found', { message: 'Entity Record Not Found', user: ctx.state.user });

    ctx.type = 'html';
    return ctx.render('entity/id', { record, params: ctx.params, user: ctx.state.user });

});


export default router;
