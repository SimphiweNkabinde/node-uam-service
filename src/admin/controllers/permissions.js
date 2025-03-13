import Knex from 'knex';
import knexConfig from '../../../knexfile.js';
const knex = Knex(knexConfig);

async function create(data) {
    const permission = await knex('permissions')
        .insert({ name: data.name, description: data.description })
        .returning('*');

    const permissionId = permission[0].id;

    const permissionServiceLink = await knex('permissions_service_links')
        .insert({ permission_id: permissionId, service_id: data.serviceId })
        .returning('*');

    return permissionServiceLink[0];
}

async function remove(id) {
    const permissions = await knex('permissions')
        .select('*')
        .where({ id });

    if (!permissions.length) return null;

    return knex('permissions')
        .where('id', id)
        .del();
}

export default { create, remove };
