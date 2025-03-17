/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export const seed = async function(knex) {
    // Deletes ALL existing entries
    await knex('groups').del();
    await knex('groups').insert([
        { name: 'group 1', description: 'the first group' },
        { name: 'group 2', description: 'the second group' },
        { name: 'group 3', description: 'the third group' },
    ]);
};
