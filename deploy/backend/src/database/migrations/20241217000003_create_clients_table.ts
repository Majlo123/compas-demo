import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  const exists = await knex.schema.hasTable('clients');
  if (exists) {
    console.log('Table "clients" already exists, skipping creation.');
    return;
  }

  await knex.schema.createTable('clients', (table) => {
    table.uuid('id').primary().defaultTo(knex.raw('gen_random_uuid()'));
    table.string('name', 255).notNullable().unique();
    table.decimal('hourly_rate', 12, 2).notNullable();
    table.timestamp('created_at').defaultTo(knex.fn.now());
    table.timestamp('updated_at').defaultTo(knex.fn.now());

    table.check('?? > 0', ['hourly_rate'], 'chk_hourly_rate');
  });

  await knex.schema.raw('CREATE INDEX IF NOT EXISTS idx_clients_name ON clients(name)');
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTableIfExists('clients');
}
