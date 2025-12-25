import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  // Check if table already exists (for initial migration from SQL)
  const exists = await knex.schema.hasTable('warning_level');
  if (exists) {
    console.log('Table "warning_level" already exists, skipping creation.');
    return;
  }

  await knex.schema.createTable('warning_level', (table) => {
    table.uuid('id').primary().defaultTo(knex.raw('gen_random_uuid()'));
    table.string('name', 255).notNullable();
    table.string('description', 255).nullable();
    table.timestamp('created_at').defaultTo(knex.fn.now());
    table.timestamp('updated_at').defaultTo(knex.fn.now());
  });

  // Create indexes
  await knex.schema.raw('CREATE INDEX IF NOT EXISTS idx_warning_level_name ON warning_level(name)');
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTableIfExists('warning_level');
}
