import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  // Check if table already exists (for initial migration from SQL)
  const exists = await knex.schema.hasTable('users');
  if (exists) {
    console.log('Table "users" already exists, skipping creation.');
    return;
  }

  await knex.schema.createTable('users', (table) => {
    table.uuid('id').primary().defaultTo(knex.raw('gen_random_uuid()'));
    table.string('full_name', 255).notNullable();
    table.string('email', 255).unique().notNullable();
    table.string('password_hash', 255).notNullable();
    table.string('role', 20).notNullable().defaultTo('employee');
    table.boolean('is_activated').notNullable().defaultTo(true);
    table.boolean('email_notifications_enabled').notNullable().defaultTo(true);
    table.integer('vacation_days_init').notNullable().defaultTo(0);
    table.integer('vacation_days_left').notNullable().defaultTo(0);
    table.binary('profile_image_blob');
    table.timestamp('created_at').defaultTo(knex.fn.now());
    table.timestamp('updated_at').defaultTo(knex.fn.now());

    // Add check constraints
    table.check('?? >= 0', ['vacation_days_init'], 'chk_vacation_days_init');
    table.check('?? >= 0', ['vacation_days_left'], 'chk_vacation_days_left');
    table.check("?? IN ('employee', 'admin')", ['role'], 'chk_role');
  });

  // Create indexes
  await knex.schema.raw('CREATE INDEX IF NOT EXISTS idx_users_email ON users(email)');
  await knex.schema.raw('CREATE INDEX IF NOT EXISTS idx_users_role ON users(role)');
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTableIfExists('users');
}
