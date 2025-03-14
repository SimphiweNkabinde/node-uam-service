import Knex from 'knex';
import knexConfig from '../../../knexfile.js';
import jwt from 'jsonwebtoken';
const knex = Knex(knexConfig);

async function findAll() {
    return knex('services')
        .select('*')
        .orderBy('id');
}

async function findOne(filter) {
    const service = await knex('services')
        .select('*')
        .where(filter).first();

    if (!service) return null;

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
    data.api_key = jwt.sign(data, 'secret');
    const record = await knex('services')
        .insert(data)
        .returning('*');
    return record[0];
}

async function update(id, data) {
    return await knex('services')
        .where('id', id)
        .update(data);
}

async function remove(id) {
    const services = await knex('services')
        .select('*')
        .where({ id });

    if (!services.length) return null;

    return knex('services')
        .where('id', id)
        .del();
}

export default { findAll, create, findOne, update, remove };
