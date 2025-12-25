import { Knex } from 'knex';

export async function seed(knex: Knex): Promise<void> {
  // Get warning levels
  const warningLevels = await knex('warning_level')
    .select('id', 'name')
    .orderBy('name', 'asc')
    .limit(5);

  if (warningLevels.length === 0) {
    console.log('No warning levels found. Please run warning level seeds first.');
    return;
  }

  console.log(`Found ${warningLevels.length} warning levels.`);

  // Get products from live_stock to ensure they exist
  const liveStockProducts = await knex('live_stock').select('prod_id').limit(27);

  if (liveStockProducts.length === 0) {
    console.log('No products in live_stock. Cannot create PAR levels.');
    return;
  }

  console.log(`Found ${liveStockProducts.length} products in live_stock.`);

  // Check existing PAR levels
  const existingParLevels = await knex('par_level').select('prod_id');
  const existingProdIds = existingParLevels.map((p) => p.prod_id);

  // Create PAR level configurations
  // Distribute products across different warning levels
  const parLevels = liveStockProducts
    .filter((p) => !existingProdIds.includes(p.prod_id))
    .map((product, index) => {
      const warningLevel = warningLevels[index % warningLevels.length];
      const thresholds = [5, 10, 15, 20, 25, 30];

      return {
        prod_id: product.prod_id,
        treshold: thresholds[index % thresholds.length],
        warning_level_id: warningLevel.id,
      };
    });

  if (parLevels.length > 0) {
    await knex('par_level').insert(parLevels);
    console.log(`Inserted ${parLevels.length} PAR level configurations.`);

    // Log distribution by warning level
    const distribution: { [key: string]: number } = {};
    parLevels.forEach((pl) => {
      const wlName = warningLevels.find((wl) => wl.id === pl.warning_level_id)?.name || 'Unknown';
      distribution[wlName] = (distribution[wlName] || 0) + 1;
    });

    console.log('PAR levels distribution by warning level:');
    Object.entries(distribution).forEach(([name, count]) => {
      console.log(`  ${name}: ${count} products`);
    });
  } else {
    console.log('All products already have PAR levels, skipping.');
  }
}
