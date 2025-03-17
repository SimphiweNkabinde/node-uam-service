import bcrypt from 'bcrypt';
/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export const seed = async function(knex) {

    const salt = bcrypt.genSaltSync();
    const users = [
        {
            username: 'user 1',
            email: 'userone@email.com',
            password: await bcrypt.hash('Userone@1234password', salt),
        },
        {
            username: 'user 2',
            email: 'usertwo@email.com',
            password: await bcrypt.hash('Usertwo@1234password', salt),
        },
        {
            username: 'user 3',
            email: 'userthree@email.com',
            password: await bcrypt.hash('Userthree@1234password', salt),
        },
    ];

    // Deletes ALL existing entries
    await knex('users').del();
    await knex('users').insert(users);
};
