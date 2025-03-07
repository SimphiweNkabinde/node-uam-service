/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export const up = function(knex) {
    return knex.schema.createTable('permissions_service_links', (table) => {
        table.increments();
        table.integer('service_id').unsigned();
        table.foreign('service_id')
            .references('id')
            .inTable('services')
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
    return knex.schema.dropTable('permissions_service_links');
};
