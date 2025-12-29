import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  // Check if table already exists
  const exists = await knex.schema.hasTable('live_stock');
  if (exists) {
    console.log('Table "live_stock" already exists, skipping creation.');
    return;
  }

  await knex.schema.createTable('live_stock', (table) => {
    table.string('prod_id', 255).primary();
    table.integer('quantity').notNullable().defaultTo(0);
    table.timestamp('created_at').defaultTo(knex.fn.now());
    table.timestamp('updated_at').defaultTo(knex.fn.now());

    // Foreign key constraint to products table
    table.foreign('prod_id').references('prod_id').inTable('products');
  });

  // Create index for faster queries
  await knex.schema.raw('CREATE INDEX IF NOT EXISTS idx_live_stock_prod_id ON live_stock(prod_id)');
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTableIfExists('live_stock');
}
