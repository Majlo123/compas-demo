import { Knex } from 'knex';

// Demonstrates a safe column rename pattern
export async function up(knex: Knex): Promise<void> {
  const hasUsername = await knex.schema.hasColumn('users', 'username');
  const hasHandle = await knex.schema.hasColumn('users', 'handle');

  if (hasUsername && !hasHandle) {
    await knex.schema.alterTable('users', (table) => {
      table.renameColumn('username', 'handle');
    });
  }
}

export async function down(knex: Knex): Promise<void> {
  const hasUsername = await knex.schema.hasColumn('users', 'username');
  const hasHandle = await knex.schema.hasColumn('users', 'handle');

  if (!hasUsername && hasHandle) {
    await knex.schema.alterTable('users', (table) => {
      table.renameColumn('handle', 'username');
    });
  }
}
