import Knex from 'knex';
import knexConfig from '../../../knexfile.js';
const knex = Knex(knexConfig);


async function getServicePermissions(userId, serviceId) {

    const userPermissions = await knex('permissions_users_links')
        .select([
            'permissions.name',
            'permissions.description'])
        .leftJoin('permissions', 'permissions.id', '=', 'permissions_users_links.permission_id')
        .leftJoin('permissions_service_links', 'permissions_service_links.permission_id', '=', 'permissions.id')
        .where({ 'permissions_users_links.user_id': userId, 'permissions_service_links.service_id': serviceId });

    const groupPermissions = await knex('groups_users_links')
        .select([
            'permissions.name',
            'permissions.description'])
        .leftJoin('groups_permissions_links', 'groups_permissions_links.group_id', '=', 'groups_users_links.group_id')
        .leftJoin('permissions', 'permissions.id', '=', 'groups_permissions_links.permission_id')
        .leftJoin('permissions_service_links', 'permissions_service_links.permission_id', '=', 'permissions.id')
        .where({ 'groups_users_links.user_id': userId, 'permissions_service_links.service_id': serviceId });;

    return [...groupPermissions, ...userPermissions];
}

async function findService(filter) {
    return knex('services')
        .select(['id', 'name'])
        .where(filter)
        .first();
}


export default { getServicePermissions, findService };
