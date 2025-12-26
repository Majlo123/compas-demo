import { Knex } from 'knex';

export async function seed(knex: Knex): Promise<void> {
  try {
    // Check if par levels already exist (avoid duplicates)
    const existingParLevels = await knex('par_level').select('prod_id');
    const existingIds = existingParLevels.map(p => p.prod_id);

    // Get the first warning level ID (assuming it exists from seed 01_warnings.ts)
    const warningLevels = await knex('warning_level').select('id').limit(1);
    if (warningLevels.length === 0) {
      console.log('No warning levels found. Please ensure warning levels are seeded first.');
      return;
    }
    const defaultWarningLevelId = warningLevels[0].id;

  const parLevels = [
    { prod_id: '1001', treshold: 200, warning_level_id: defaultWarningLevelId },
    { prod_id: '1002', treshold: 100, warning_level_id: defaultWarningLevelId },
    { prod_id: '1003', treshold: 30, warning_level_id: defaultWarningLevelId },
    { prod_id: '1004', treshold: 80, warning_level_id: defaultWarningLevelId },
    { prod_id: '1005', treshold: 150, warning_level_id: defaultWarningLevelId },
    { prod_id: '1006', treshold: 60, warning_level_id: defaultWarningLevelId },
    { prod_id: '1007', treshold: 100, warning_level_id: defaultWarningLevelId },
    { prod_id: '1008', treshold: 80, warning_level_id: defaultWarningLevelId },
    { prod_id: '1009', treshold: 120, warning_level_id: defaultWarningLevelId },
    { prod_id: '2001', treshold: 50, warning_level_id: defaultWarningLevelId },
    { prod_id: '2002', treshold: 40, warning_level_id: defaultWarningLevelId },
    { prod_id: '2003', treshold: 25, warning_level_id: defaultWarningLevelId },
    { prod_id: '2004', treshold: 30, warning_level_id: defaultWarningLevelId },
    { prod_id: '2005', treshold: 20, warning_level_id: defaultWarningLevelId },
    { prod_id: '2006', treshold: 15, warning_level_id: defaultWarningLevelId },
    { prod_id: '3001', treshold: 100, warning_level_id: defaultWarningLevelId },
    { prod_id: '3002', treshold: 60, warning_level_id: defaultWarningLevelId },
    { prod_id: '3003', treshold: 50, warning_level_id: defaultWarningLevelId },
    { prod_id: '3004', treshold: 70, warning_level_id: defaultWarningLevelId },
    { prod_id: '3005', treshold: 60, warning_level_id: defaultWarningLevelId },
    { prod_id: '3006', treshold: 50, warning_level_id: defaultWarningLevelId },
    { prod_id: '4001', treshold: 20, warning_level_id: defaultWarningLevelId },
    { prod_id: '4002', treshold: 15, warning_level_id: defaultWarningLevelId },
    { prod_id: '4003', treshold: 12, warning_level_id: defaultWarningLevelId },
    { prod_id: '5001', treshold: 2, warning_level_id: defaultWarningLevelId },
    { prod_id: '5002', treshold: 500, warning_level_id: defaultWarningLevelId },
    { prod_id: '5003', treshold: 5, warning_level_id: defaultWarningLevelId },
    { prod_id: '5004', treshold: 300, warning_level_id: defaultWarningLevelId },
    { prod_id: '5005', treshold: 40, warning_level_id: defaultWarningLevelId },
    { prod_id: '6001', treshold: 100, warning_level_id: defaultWarningLevelId },
    { prod_id: '6002', treshold: 45, warning_level_id: defaultWarningLevelId },
    { prod_id: '6003', treshold: 35, warning_level_id: defaultWarningLevelId },
    { prod_id: '6004', treshold: 50, warning_level_id: defaultWarningLevelId },
    { prod_id: '7001', treshold: 120, warning_level_id: defaultWarningLevelId },
    { prod_id: '7002', treshold: 100, warning_level_id: defaultWarningLevelId },
    { prod_id: '7003', treshold: 60, warning_level_id: defaultWarningLevelId },
    { prod_id: '7004', treshold: 25, warning_level_id: defaultWarningLevelId },
    { prod_id: '8001', treshold: 40, warning_level_id: defaultWarningLevelId },
    { prod_id: '8002', treshold: 45, warning_level_id: defaultWarningLevelId },
    { prod_id: '8003', treshold: 25, warning_level_id: defaultWarningLevelId },
    { prod_id: '9001', treshold: 20, warning_level_id: defaultWarningLevelId },
    { prod_id: '9002', treshold: 18, warning_level_id: defaultWarningLevelId },
    { prod_id: '9003', treshold: 90, warning_level_id: defaultWarningLevelId },
    { prod_id: '10001', treshold: 35, warning_level_id: defaultWarningLevelId },
    { prod_id: '10002', treshold: 30, warning_level_id: defaultWarningLevelId },
    { prod_id: '10003', treshold: 80, warning_level_id: defaultWarningLevelId },
    { prod_id: '11001', treshold: 100, warning_level_id: defaultWarningLevelId },
    { prod_id: '11002', treshold: 90, warning_level_id: defaultWarningLevelId },
    { prod_id: '11003', treshold: 40, warning_level_id: defaultWarningLevelId },
    { prod_id: '11004', treshold: 70, warning_level_id: defaultWarningLevelId },
    { prod_id: '12001', treshold: 45, warning_level_id: defaultWarningLevelId },
    { prod_id: '12002', treshold: 50, warning_level_id: defaultWarningLevelId },
    { prod_id: '12003', treshold: 35, warning_level_id: defaultWarningLevelId },
    { prod_id: '13001', treshold: 40, warning_level_id: defaultWarningLevelId },
    { prod_id: '13002', treshold: 25, warning_level_id: defaultWarningLevelId },
    { prod_id: '13003', treshold: 55, warning_level_id: defaultWarningLevelId },
    { prod_id: '14001', treshold: 75, warning_level_id: defaultWarningLevelId },
    { prod_id: '14002', treshold: 50, warning_level_id: defaultWarningLevelId },
    { prod_id: '14003', treshold: 80, warning_level_id: defaultWarningLevelId },
    { prod_id: '15001', treshold: 65, warning_level_id: defaultWarningLevelId },
    { prod_id: '15002', treshold: 60, warning_level_id: defaultWarningLevelId },
    { prod_id: '15003', treshold: 40, warning_level_id: defaultWarningLevelId },
    { prod_id: '16001', treshold: 100, warning_level_id: defaultWarningLevelId },
    { prod_id: '16002', treshold: 30, warning_level_id: defaultWarningLevelId },
    { prod_id: '17001', treshold: 65, warning_level_id: defaultWarningLevelId },
    { prod_id: '17002', treshold: 55, warning_level_id: defaultWarningLevelId },
    { prod_id: '17003', treshold: 45, warning_level_id: defaultWarningLevelId },
    { prod_id: '17004', treshold: 42, warning_level_id: defaultWarningLevelId },
    { prod_id: '18001', treshold: 75, warning_level_id: defaultWarningLevelId },
  ];

    // Only insert par levels that don't exist
    const newParLevels = parLevels.filter(p => !existingIds.includes(p.prod_id));

    if (newParLevels.length > 0) {
      await knex('par_level').insert(newParLevels);
      console.log(`Inserted ${newParLevels.length} new par levels.`);
    } else {
      console.log('All seed par levels already exist, skipping.');
    }
  } catch (error) {
    console.error('Error in par_level seed:', error);
    throw error;
  }
}
