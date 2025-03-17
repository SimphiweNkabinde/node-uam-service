/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export const seed = async function(knex) {
    // Deletes ALL existing entries
    await knex('groups_users_links').del();
    await knex('groups_users_links').insert([
        { user_id: 1, group_id: 1 },
        { user_id: 1, group_id: 2 },
        { user_id: 1, group_id: 3 },
    ]);
};
