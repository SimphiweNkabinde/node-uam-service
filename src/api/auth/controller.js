import Knex from 'knex';
import knexConfig from '../../../knexfile.js';
const knex = Knex(knexConfig);
import bcrypt from 'bcrypt';

async function findOneByEmail(email) {
    return knex('users')
        .select('*')
        .where({ email }).first();
}

async function register(user) {
    const salt = await bcrypt.genSalt();
    const hash = await bcrypt.hash(user.password, salt);
    user.password = hash;
    const newUser = await knex('users')
        .insert(user)
        .returning([
            'id',
            'username',
            'email',
            'created_at as createdAt',
            'updated_at as updatedAt',
        ]);

    return newUser[0];
}

async function validatePassword(password, encryptedPassword) {
    return await bcrypt.compare(password, encryptedPassword);
}

export default { findOneByEmail, register, validatePassword  };
