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

    if (!permissions || !permissions.length) return null;

    return knex('permissions')
        .where('id', id)
        .del();
}

async function assignToUser(data) {
    return await knex('permissions_users_links')
        .insert({ permission_id: data.permissionId, user_id: data.userId })
        .returning('*');
}

async function assignToGroup(data) {
    return await knex('groups_permissions_links')
        .insert({ permission_id: data.permissionId, group_id: data.groupId })
        .returning('*');
}

async function findAll() {
    return knex('permissions')
        .select([
            'permissions.name',
            'permissions.id',
            'permissions.description',
            'services.id as service_id',
            'services.name as service_name',
        ])
        .leftJoin('permissions_service_links', 'permissions_service_links.permission_id', '=', 'permissions.id')
        .leftJoin('services', 'services.id', '=', 'permissions_service_links.service_id')
        .orderBy('id');
}

export default { create, remove, assignToUser, findAll, assignToGroup };
