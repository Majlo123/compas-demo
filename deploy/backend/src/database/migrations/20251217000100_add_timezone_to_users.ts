import { Knex } from 'knex';

// Adds a new non-nullable column with a default
export async function up(knex: Knex): Promise<void> {
  const hasColumn = await knex.schema.hasColumn('users', 'timezone');
  if (!hasColumn) {
    await knex.schema.alterTable('users', (table) => {
      table.string('timezone', 64).notNullable().defaultTo('UTC');
    });
  }
}

export async function down(knex: Knex): Promise<void> {
  const hasColumn = await knex.schema.hasColumn('users', 'timezone');
  if (hasColumn) {
    await knex.schema.alterTable('users', (table) => {
      table.dropColumn('timezone');
    });
  }
}
