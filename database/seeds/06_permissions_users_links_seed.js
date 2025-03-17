/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export const seed = async function(knex) {
    // Deletes ALL existing entries
    await knex('permissions_users_links').del();
    await knex('permissions_users_links').insert([
        { permission_id: 3, user_id: 1 },
        { permission_id: 2, user_id: 2 },
        { permission_id: 2, user_id: 3 },
    ]);
};
