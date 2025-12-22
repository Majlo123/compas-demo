import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  const exists = await knex.schema.hasTable('collective_days_off');
  if (exists) {
    console.log('Table "collective_days_off" already exists, skipping creation.');
    return;
  }

  await knex.schema.createTable('collective_days_off', (table) => {
    table.uuid('id').primary().defaultTo(knex.raw('gen_random_uuid()'));
    table.date('start_date').notNullable();
    table.date('end_date').notNullable();
    table.text('description').notNullable();
    table.timestamp('created_at').defaultTo(knex.fn.now());
    table.timestamp('updated_at').defaultTo(knex.fn.now());

    table.check('?? >= ??', ['end_date', 'start_date'], 'valid_date_range');
  });

  await knex.schema.raw('CREATE INDEX IF NOT EXISTS idx_collective_days_off_start_date ON collective_days_off(start_date DESC)');
  await knex.schema.raw('CREATE INDEX IF NOT EXISTS idx_collective_days_off_end_date ON collective_days_off(end_date DESC)');
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTableIfExists('collective_days_off');
}
