/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export const up = function(knex) {
    return knex.schema.createTable('permissions_users_links', (table) => {
        table.increments();
        table.integer('permission_id').unsigned();
        table.foreign('permission_id')
            .references('id')
            .inTable('permissions')
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
    return knex.schema.dropTable('permissions_users_links');
};
