import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  const exists = await knex.schema.hasTable('time_entries');
  if (exists) {
    console.log('Table "time_entries" already exists, skipping creation.');
    return;
  }

  await knex.schema.createTable('time_entries', (table) => {
    table.uuid('id').primary().defaultTo(knex.raw('gen_random_uuid()'));
    table.uuid('user_id').notNullable().references('id').inTable('users').onDelete('CASCADE');
    table.string('project_name', 255).notNullable();
    table.text('description');
    table.timestamp('start_time').notNullable();
    table.timestamp('end_time').notNullable();
    table.boolean('is_overtime').notNullable().defaultTo(false);
    table.boolean('is_billable').notNullable().defaultTo(false);
    table.timestamp('created_at').defaultTo(knex.fn.now());
    table.timestamp('updated_at').defaultTo(knex.fn.now());

    table.check('?? > ??', ['end_time', 'start_time'], 'valid_time_range');
  });

  await knex.schema.raw('CREATE INDEX IF NOT EXISTS idx_time_entries_user_id ON time_entries(user_id)');
  await knex.schema.raw('CREATE INDEX IF NOT EXISTS idx_time_entries_start_time ON time_entries(start_time DESC)');
  await knex.schema.raw('CREATE INDEX IF NOT EXISTS idx_time_entries_project_name ON time_entries(project_name)');
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTableIfExists('time_entries');
}
