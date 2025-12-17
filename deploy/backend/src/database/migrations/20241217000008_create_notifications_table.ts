import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  const exists = await knex.schema.hasTable('leave_request_notifications');
  if (exists) {
    console.log('Table "leave_request_notifications" already exists, skipping creation.');
    return;
  }

  await knex.schema.createTable('leave_request_notifications', (table) => {
    table.uuid('id').primary().defaultTo(knex.raw('gen_random_uuid()'));
    table.uuid('user_id').notNullable().references('id').inTable('users').onDelete('CASCADE');
    table.uuid('leave_request_id').notNullable().references('id').inTable('leave_requests').onDelete('CASCADE');
    table.string('title', 500).notNullable();
    table.boolean('is_read').notNullable().defaultTo(false);
    table.timestamp('created_at').defaultTo(knex.fn.now());
  });

  await knex.schema.raw('CREATE INDEX IF NOT EXISTS idx_leave_request_notifications_user_id ON leave_request_notifications(user_id)');
  await knex.schema.raw('CREATE INDEX IF NOT EXISTS idx_leave_request_notifications_leave_request_id ON leave_request_notifications(leave_request_id)');
  await knex.schema.raw('CREATE INDEX IF NOT EXISTS idx_leave_request_notifications_is_read ON leave_request_notifications(is_read)');
  await knex.schema.raw('CREATE INDEX IF NOT EXISTS idx_leave_request_notifications_created_at ON leave_request_notifications(created_at DESC)');
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTableIfExists('leave_request_notifications');
}
