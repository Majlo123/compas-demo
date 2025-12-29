import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  // Check if table already exists
  const exists = await knex.schema.hasTable('par_level');
  if (exists) {
    console.log('Table "par_level" already exists, skipping creation.');
    return;
  }

  await knex.schema.createTable('par_level', (table) => {
    table.string('prod_id', 255).primary();
    table.integer('treshold').notNullable();
    table.uuid('warning_level_id').notNullable();
    table.timestamp('created_at').defaultTo(knex.fn.now());
    table.timestamp('updated_at').defaultTo(knex.fn.now());

    // Foreign key constraints
    table.foreign('prod_id').references('prod_id').inTable('live_stock');
    table.foreign('warning_level_id').references('id').inTable('warning_level');

    // Check constraint to ensure threshold is positive
    table.check('treshold >= 0');
  });

  // Create indexes for faster queries
  await knex.schema.raw('CREATE INDEX IF NOT EXISTS idx_par_level_prod_id ON par_level(prod_id)');
  await knex.schema.raw(
    'CREATE INDEX IF NOT EXISTS idx_par_level_warning_level_id ON par_level(warning_level_id)',
  );
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTableIfExists('par_level');
}
