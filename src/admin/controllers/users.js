import Knex from 'knex';
import knexConfig from '../../../knexfile.js';
const knex = Knex(knexConfig);

async function findAll() {
    return knex('users')
        .select('*');
}

async function findOne(filter) {
    return await knex('users')
        .select('*')
        .where(filter).first();
}

export default { findAll, findOne };
