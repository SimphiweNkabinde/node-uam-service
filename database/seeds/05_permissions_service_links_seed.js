/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export const seed = async function(knex) {
    // Deletes ALL existing entries
    await knex('permissions_service_links').del();
    await knex('permissions_service_links').insert([
        { permission_id: 1, service_id: 1 },
        { permission_id: 2, service_id: 2 },
        { permission_id: 3, service_id: 2 },
    ]);
};
