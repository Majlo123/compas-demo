import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
    await knex.schema.alterTable('par_level', (table) => {
        // Drop existing primary key on prod_id (constraint name is usually par_level_pkey by default)
        table.dropPrimary();
        // Add composite primary key
        table.primary(['prod_id', 'warning_level_id']);
    });
}

export async function down(knex: Knex): Promise<void> {
    await knex.schema.alterTable('par_level', (table) => {
        table.dropPrimary();
        table.primary(['prod_id']);
    });
}
