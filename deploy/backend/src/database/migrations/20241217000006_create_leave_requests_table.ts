import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  const exists = await knex.schema.hasTable('leave_requests');
  if (exists) {
    console.log('Table "leave_requests" already exists, skipping creation.');
    return;
  }

  await knex.schema.createTable('leave_requests', (table) => {
    table.uuid('id').primary().defaultTo(knex.raw('gen_random_uuid()'));
    table.uuid('user_id').notNullable().references('id').inTable('users').onDelete('CASCADE');
    table.string('type', 20).notNullable();
    table.date('start_date').notNullable();
    table.date('end_date').notNullable();
    table.string('status', 20).notNullable().defaultTo('pending');
    table.text('reason');
    table.timestamp('created_at').defaultTo(knex.fn.now());
    table.timestamp('updated_at').defaultTo(knex.fn.now());

    table.check("?? IN ('vacation', 'sick', 'personal', 'other')", ['type'], 'chk_leave_type');
    table.check("?? IN ('approved', 'pending', 'declined')", ['status'], 'chk_leave_status');
    table.check('?? >= ??', ['end_date', 'start_date'], 'valid_date_range');
  });

  await knex.schema.raw('CREATE INDEX IF NOT EXISTS idx_leave_requests_user_id ON leave_requests(user_id)');
  await knex.schema.raw('CREATE INDEX IF NOT EXISTS idx_leave_requests_status ON leave_requests(status)');
  await knex.schema.raw('CREATE INDEX IF NOT EXISTS idx_leave_requests_start_date ON leave_requests(start_date DESC)');
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTableIfExists('leave_requests');
}
