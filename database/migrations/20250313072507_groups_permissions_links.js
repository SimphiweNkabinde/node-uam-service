/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export const up = function(knex) {
    return knex.schema.createTable('groups_permissions_links', (table) => {
        table.increments();
        table.integer('group_id').unsigned();
        table.foreign('group_id')
            .references('id')
            .inTable('groups')
            .deferrable('deferred')
            .onDelete('CASCADE');
        table.integer('permission_id').unsigned();
        table.foreign('permission_id')
            .references('id')
            .inTable('permissions')
            .deferrable('deferred')
            .onDelete('CASCADE');
    });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export const down = function(knex) {
    return knex.schema.dropTable('groups_permissions_links');
};
