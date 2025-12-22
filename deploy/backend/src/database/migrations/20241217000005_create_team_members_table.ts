import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  const exists = await knex.schema.hasTable('team_members');
  if (exists) {
    console.log('Table "team_members" already exists, skipping creation.');
    return;
  }

  await knex.schema.createTable('team_members', (table) => {
    table.uuid('id').primary().defaultTo(knex.raw('gen_random_uuid()'));
    table.uuid('team_id').notNullable().references('id').inTable('teams').onDelete('CASCADE');
    table.uuid('user_id').notNullable().references('id').inTable('users').onDelete('CASCADE');
    table.boolean('is_manager').defaultTo(false);
    table.timestamp('joined_at').defaultTo(knex.fn.now());
    table.timestamp('updated_at').defaultTo(knex.fn.now());

    table.unique(['team_id', 'user_id'], { indexName: 'uq_team_user' });
  });

  await knex.schema.raw('CREATE INDEX IF NOT EXISTS idx_team_members_team_id ON team_members(team_id)');
  await knex.schema.raw('CREATE INDEX IF NOT EXISTS idx_team_members_user_id ON team_members(user_id)');
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTableIfExists('team_members');
}
