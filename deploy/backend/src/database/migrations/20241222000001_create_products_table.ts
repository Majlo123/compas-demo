import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  // Check if table already exists
  const exists = await knex.schema.hasTable('products');
  if (exists) {
    console.log('Table "products" already exists, skipping creation.');
    return;
  }

  await knex.schema.createTable('products', (table) => {
    table.string('prod_id', 255).primary();
    table.string('description', 255).notNullable();
    table.string('commodity_group_id', 255).notNullable();
    table.string('commodity_group', 255).notNullable();
    table.timestamp('created_at').defaultTo(knex.fn.now());
    table.timestamp('updated_at').defaultTo(knex.fn.now());
  });

  // Create indexes
  await knex.schema.raw('CREATE INDEX IF NOT EXISTS idx_products_commodity_group_id ON products(commodity_group_id)');
  await knex.schema.raw('CREATE INDEX IF NOT EXISTS idx_products_commodity_group ON products(commodity_group)');
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTableIfExists('products');
}
