import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  const exists = await knex.schema.hasTable('teams');
  if (exists) {
    console.log('Table "teams" already exists, skipping creation.');
    return;
  }

  await knex.schema.createTable('teams', (table) => {
    table.uuid('id').primary().defaultTo(knex.raw('gen_random_uuid()'));
    table.string('name', 255).notNullable();
    table.text('description');
    table.uuid('client_id').references('id').inTable('clients').onDelete('SET NULL');
    table.timestamp('created_at').defaultTo(knex.fn.now());
    table.timestamp('updated_at').defaultTo(knex.fn.now());
  });

  await knex.schema.raw('CREATE UNIQUE INDEX IF NOT EXISTS idx_teams_name ON teams(name)');
  await knex.schema.raw('CREATE INDEX IF NOT EXISTS idx_teams_client_id ON teams(client_id)');
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTableIfExists('teams');
}
