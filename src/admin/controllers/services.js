import Knex from 'knex';
import knexConfig from '../../../knexfile.js';
const knex = Knex(knexConfig);

async function findAll() {
    return knex('services')
        .select('*');
}

async function findOne(filter) {
    return await knex('services')
        .select('*')
        .where(filter).first();
}

async function create(data) {
    const api_key = data.name.replaceAll(' ', '-');
    const record = await knex('services')
        .insert({ ...data, api_key })
        .returning('*');
    return record[0];
}

export default { findAll, create, findOne };
