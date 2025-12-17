import { Knex } from 'knex';

// Safely removes an obsolete column if it exists
export async function up(knex: Knex): Promise<void> {
  const hasColumn = await knex.schema.hasColumn('users', 'legacy_nickname');
  if (hasColumn) {
    await knex.schema.alterTable('users', (table) => {
      table.dropColumn('legacy_nickname');
    });
  }
}

// Restores the column (shape as example) if you rollback
export async function down(knex: Knex): Promise<void> {
  const hasColumn = await knex.schema.hasColumn('users', 'legacy_nickname');
  if (!hasColumn) {
    await knex.schema.alterTable('users', (table) => {
      table.string('legacy_nickname', 128).nullable();
    });
  }
}
