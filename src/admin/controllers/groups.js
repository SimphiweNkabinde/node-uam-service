import Knex from 'knex';
import knexConfig from '../../../knexfile.js';
const knex = Knex(knexConfig);

async function findAll() {
    return knex('groups')
        .select('*');
}

async function findOne(filter) {
    return await knex('groups')
        .select('*')
        .where(filter).first();
}

async function create(data) {
    const record = await knex('groups')
        .insert(data)
        .returning('*');
    return record[0];
}

export default { findAll, create, findOne };
