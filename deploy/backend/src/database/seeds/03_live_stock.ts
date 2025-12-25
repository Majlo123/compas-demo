import { Knex } from 'knex';

export async function seed(knex: Knex): Promise<void> {
  // Get products to create live_stock entries for
  const products = await knex('products').select('prod_id').limit(27);

  if (products.length === 0) {
    console.log('No products found. Please run products seed first.');
    return;
  }

  console.log(`Found ${products.length} products.`);

  // Check existing live_stock entries
  const existingLiveStock = await knex('live_stock').select('prod_id');
  const existingProdIds = existingLiveStock.map((ls) => ls.prod_id);

  // Create live_stock entries for products that don't have them
  const liveStockEntries = products
    .filter((p) => !existingProdIds.includes(p.prod_id))
    .map((product) => ({
      prod_id: product.prod_id,
      quantity: Math.floor(Math.random() * 100) + 10, // Random quantity between 10 and 109
    }));

  if (liveStockEntries.length > 0) {
    await knex('live_stock').insert(liveStockEntries);
    console.log(`Inserted ${liveStockEntries.length} live_stock entries.`);
  } else {
    console.log('All products already have live_stock entries, skipping.');
  }
}
