import Knex from 'knex';
import knexConfig from '../../../knexfile.js';
const knex = Knex(knexConfig);

async function findAll(entity) {
    return knex(entity)
        .select('*');
}

async function findOne(entity, filter) {
    return knex(entity)
        .select('*')
        .where(filter).first();
}

export default { findAll, findOne  };
