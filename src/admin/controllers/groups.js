import Knex from 'knex';
import knexConfig from '../../../knexfile.js';
const knex = Knex(knexConfig);

async function findAll() {
    return knex('groups')
        .select('*');
}

async function findOne(filter) {
    const group = await knex('groups')
        .select('*')
        .where(filter).first();

    if (!group) return null;

    const users = await knex('groups_users_links')
        .select([
            'users.id',
            'users.username',
            'users.email',
        ])
        .leftJoin('users', 'users.id', '=', 'groups_users_links.user_id')
        .where({ group_id: filter.id });

    group.users = users;


    const permissions = await knex('groups_permissions_links')
        .select([
            'permissions.id',
            'permissions.name',
            'permissions.description',
            'services.name as service_name',
            'services.id as service_id'])
        .leftJoin('permissions', 'permissions.id', '=', 'groups_permissions_links.permission_id')
        .leftJoin('permissions_service_links', 'permissions_service_links.permission_id', '=', 'permissions.id')
        .leftJoin('services', 'services.id', '=', 'permissions_service_links.service_id')
        .where({ group_id: filter.id });

    group.permissions = permissions;

    return group;
}

async function create(data) {
    const record = await knex('groups')
        .insert(data)
        .returning('*');
    return record[0];
}

async function update(id, data) {
    return await knex('groups')
        .where('id', id)
        .update(data);
}

async function remove(id) {
    const groups = await knex('groups')
        .select('*')
        .where({ id });

    if (!groups.length) return null;

    return knex('groups')
        .where('id', id)
        .del();
}

async function assignToUser(data) {
    return await knex('groups_users_links')
        .insert({ group_id: data.groupId, user_id: data.userId })
        .returning('*');
}

async function removeUserLink(id) {
    return await knex('groups_users_links')
        .where('id', id)
        .del();
}

export default { findAll, create, findOne, update, remove, assignToUser, removeUserLink };
