import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  const exists = await knex.schema.hasTable('user_invites');
  if (exists) {
    console.log('Table "user_invites" already exists, skipping creation.');
    return;
  }

  await knex.schema.createTable('user_invites', (table) => {
    table.uuid('id').primary().defaultTo(knex.raw('gen_random_uuid()'));
    table.string('email', 255).notNullable().unique();
    table.string('token', 500).notNullable().unique();
    table.string('status', 20).notNullable().defaultTo('pending');
    table.timestamp('expires_at').notNullable();
    table.timestamp('created_at').defaultTo(knex.fn.now());
    table.timestamp('used_at');

    table.check("?? IN ('pending', 'accepted', 'expired', 'revoked')", ['status'], 'chk_invite_status');
  });

  await knex.schema.raw('CREATE INDEX IF NOT EXISTS idx_user_invites_email ON user_invites(email)');
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTableIfExists('user_invites');
}
