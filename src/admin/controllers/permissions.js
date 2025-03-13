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

export default { create };
