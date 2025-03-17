/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export const seed = async function(knex) {
    // Deletes ALL existing entries
    await knex('groups_permissions_links').del();
    await knex('groups_permissions_links').insert([
        { permission_id: 3, group_id: 1 },
        { permission_id: 2, group_id: 2 },
        { permission_id: 2, group_id: 3 },
    ]);
};
