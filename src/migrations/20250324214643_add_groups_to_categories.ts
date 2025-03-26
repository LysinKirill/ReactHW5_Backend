import type { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
    return knex.schema.alterTable('categories', (table) => {
        table.jsonb('allowed_groups').notNullable().defaultTo(JSON.stringify(['admin']));
    });
}

export async function down(knex: Knex): Promise<void> {
    return knex.schema.alterTable('categories', (table) => {
        table.dropColumn('allowed_groups');
    });
}