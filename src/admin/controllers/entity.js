import Knex from 'knex';
import knexConfig from '../../../knexfile.js';
const knex = Knex(knexConfig);

async function getAll(entity) {
    return knex(entity)
        .select('*');
}

export default { getAll  };
