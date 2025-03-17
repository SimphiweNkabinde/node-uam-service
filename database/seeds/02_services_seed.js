/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export const seed = async function(knex) {
    // Deletes ALL existing entries
    await knex('services').del();
    await knex('services').insert([
        { name: 'service 1', description: 'the first service', api_key: 'service-1' },
        { name: 'service 2', description: 'the second service', api_key: 'service-2' },
        { name: 'service 3', description: 'the third service', api_key: 'service-3' },
    ]);
};
