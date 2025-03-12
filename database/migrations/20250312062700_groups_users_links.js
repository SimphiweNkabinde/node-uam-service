/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export const up = function(knex) {
    return knex.schema.createTable('groups_users_links', (table) => {
        table.increments();
        table.integer('group_id').unsigned();
        table.foreign('group_id')
            .references('id')
            .inTable('groups')
            .deferrable('deferred')
            .onDelete('CASCADE');
        table.integer('user_id').unsigned();
        table.foreign('user_id')
            .references('id')
            .inTable('users')
            .deferrable('deferred')
            .onDelete('CASCADE');
    });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export const down = function(knex) {
    return knex.schema.dropTable('groups_users_links');
};
