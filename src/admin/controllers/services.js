import Knex from 'knex';
import knexConfig from '../../../knexfile.js';
const knex = Knex(knexConfig);

async function findAll() {
    return knex('services')
        .select('*');
}

async function findOne(filter) {
    const service = await knex('services')
        .select('*')
        .where(filter).first();

    const permissions = await knex('permissions_service_links')
        .select([
            'permissions.id',
            'permissions.name',
            'permissions.description',
            'permissions.created_at',
            'permissions.updated_at',
        ])
        .leftJoin('permissions', 'permissions.id', '=', 'permissions_service_links.permission_id')
        .where({ service_id: filter.id });

    service.permissions = permissions;

    return service;
}

async function create(data) {
    const api_key = data.name.replaceAll(' ', '-');
    const record = await knex('services')
        .insert({ ...data, api_key })
        .returning('*');
    return record[0];
}

async function update(id, data) {
    return await knex('services')
        .where('id', id)
        .update(data);
}

export default { findAll, create, findOne, update };
