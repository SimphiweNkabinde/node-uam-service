/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export const seed = async function(knex) {
    // Deletes ALL existing entries
    await knex('permissions').del();
    await knex('permissions').insert([
        { name: 'permission 1', description: 'the first permission' },
        { name: 'permission 2', description: 'the second permission' },
        { name: 'permission 3', description: 'the third permission' },
    ]);
};
