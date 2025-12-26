import { Knex } from 'knex';

export async function seed(knex: Knex): Promise<void> {
  try {
    // Check if live stock records already exist (avoid duplicates)
    const existingStock = await knex('live_stock').select('prod_id');
    const existingIds = existingStock.map(s => s.prod_id);

  const liveStock = [
    { prod_id: '1001', quantity: 150 },
    { prod_id: '1002', quantity: 300 },
    { prod_id: '1003', quantity: 10 },
    { prod_id: '1004', quantity: 75 },
    { prod_id: '1005', quantity: 200 },
    { prod_id: '1006', quantity: 45 },
    { prod_id: '1007', quantity: 120 },
    { prod_id: '1008', quantity: 65 },
    { prod_id: '1009', quantity: 140 },
    { prod_id: '2001', quantity: 15 },
    { prod_id: '2002', quantity: 45 },
    { prod_id: '2003', quantity: 30 },
    { prod_id: '2004', quantity: 12 },
    { prod_id: '2005', quantity: 22 },
    { prod_id: '2006', quantity: 8 },
    { prod_id: '3001', quantity: 80 },
    { prod_id: '3002', quantity: 120 },
    { prod_id: '3003', quantity: 55 },
    { prod_id: '3004', quantity: 90 },
    { prod_id: '3005', quantity: 70 },
    { prod_id: '3006', quantity: 35 },
    { prod_id: '4001', quantity: 5 },
    { prod_id: '4002', quantity: 18 },
    { prod_id: '4003', quantity: 11 },
    { prod_id: '5001', quantity: 5 },
    { prod_id: '5002', quantity: 400 },
    { prod_id: '5003', quantity: 8 },
    { prod_id: '5004', quantity: 250 },
    { prod_id: '5005', quantity: 45 },
    { prod_id: '6001', quantity: 88 },
    { prod_id: '6002', quantity: 52 },
    { prod_id: '6003', quantity: 30 },
    { prod_id: '6004', quantity: 65 },
    { prod_id: '7001', quantity: 95 },
    { prod_id: '7002', quantity: 110 },
    { prod_id: '7003', quantity: 42 },
    { prod_id: '7004', quantity: 28 },
    { prod_id: '8001', quantity: 33 },
    { prod_id: '8002', quantity: 48 },
    { prod_id: '8003', quantity: 18 },
    { prod_id: '9001', quantity: 15 },
    { prod_id: '9002', quantity: 22 },
    { prod_id: '9003', quantity: 85 },
    { prod_id: '10001', quantity: 42 },
    { prod_id: '10002', quantity: 28 },
    { prod_id: '10003', quantity: 95 },
    { prod_id: '11001', quantity: 120 },
    { prod_id: '11002', quantity: 75 },
    { prod_id: '11003', quantity: 45 },
    { prod_id: '11004', quantity: 62 },
    { prod_id: '12001', quantity: 38 },
    { prod_id: '12002', quantity: 55 },
    { prod_id: '12003', quantity: 28 },
    { prod_id: '13001', quantity: 42 },
    { prod_id: '13002', quantity: 18 },
    { prod_id: '13003', quantity: 65 },
    { prod_id: '14001', quantity: 88 },
    { prod_id: '14002', quantity: 42 },
    { prod_id: '14003', quantity: 95 },
    { prod_id: '15001', quantity: 58 },
    { prod_id: '15002', quantity: 72 },
    { prod_id: '15003', quantity: 35 },
    { prod_id: '16001', quantity: 125 },
    { prod_id: '16002', quantity: 22 },
    { prod_id: '17001', quantity: 68 },
    { prod_id: '17002', quantity: 45 },
    { prod_id: '17003', quantity: 52 },
    { prod_id: '17004', quantity: 38 },
    { prod_id: '18001', quantity: 88 },
  ];

  // Only insert stock records that don't exist
  const newStock = liveStock.filter(s => !existingIds.includes(s.prod_id));

    if (newStock.length > 0) {
      await knex('live_stock').insert(newStock);
      console.log(`Inserted ${newStock.length} new live stock records.`);
    } else {
      console.log('All seed live stock records already exist, skipping.');
    }
  } catch (error) {
    console.error('Error in live_stock seed:', error);
    throw error;
  }
}
