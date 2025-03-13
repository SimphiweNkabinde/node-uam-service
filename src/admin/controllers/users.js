import Knex from 'knex';
import knexConfig from '../../../knexfile.js';
const knex = Knex(knexConfig);

async function findAll() {
    return knex('users')
        .select('*');
}

async function findOne(filter) {
    const user = await knex('users')
        .select('*')
        .where(filter).first();

    const groups = await knex('groups_users_links')
        .select('*')
        .leftJoin('groups', 'groups.id', '=', 'groups_users_links.group_id')
        .where({ user_id: filter.id });

    user.groups = groups;

    const permissions = await knex('permissions_users_links')
        .select([
            'permissions.id',
            'permissions.name',
            'permissions.description',
            'services.name as service_name',
            'services.id as service_id'])
        .leftJoin('permissions', 'permissions.id', '=', 'permissions_users_links.permission_id')
        .leftJoin('permissions_service_links', 'permissions_service_links.permission_id', '=', 'permissions.id')
        .leftJoin('services', 'services.id', '=', 'permissions_service_links.service_id')
        .where({ user_id: filter.id });

    user.permissions = permissions;

    return user;
}

export default { findAll, findOne };
