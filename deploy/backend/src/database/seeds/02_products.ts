import { Knex } from 'knex';

// eslint-disable-next-line import/prefer-default-export
export async function seed(knex: Knex): Promise<void> {
  // Check if products already exist (avoid duplicates)
  const existingProducts = await knex('products').select('prod_id');
  const existingIds = existingProducts.map((p) => p.prod_id);

  const products = [
    {
      prod_id: '1001',
      description: 'Coca Cola 330ml',
      commodity_group_id: 'CBG_001',
      commodity_group: 'COLD BEVERAGES',
    },
    {
      prod_id: '1002',
      description: 'Still Water 500ml',
      commodity_group_id: 'CBG_001',
      commodity_group: 'COLD BEVERAGES',
    },
    {
      prod_id: '1003',
      description: 'Orange Juice 250ml',
      commodity_group_id: 'CBG_001',
      commodity_group: 'COLD BEVERAGES',
    },
    {
      prod_id: '1004',
      description: 'Apple Juice 1L',
      commodity_group_id: 'CBG_001',
      commodity_group: 'COLD BEVERAGES',
    },
    {
      prod_id: '1005',
      description: 'Sparkling Water 500ml',
      commodity_group_id: 'CBG_001',
      commodity_group: 'COLD BEVERAGES',
    },
    {
      prod_id: '1006',
      description: 'Lemonade 500ml',
      commodity_group_id: 'CBG_001',
      commodity_group: 'COLD BEVERAGES',
    },
    {
      prod_id: '1007',
      description: 'Energy Drink 250ml',
      commodity_group_id: 'CBG_001',
      commodity_group: 'COLD BEVERAGES',
    },
    {
      prod_id: '1008',
      description: 'Iced Tea Peach',
      commodity_group_id: 'CBG_001',
      commodity_group: 'COLD BEVERAGES',
    },
    {
      prod_id: '1009',
      description: 'Mineral Water 1.5L',
      commodity_group_id: 'CBG_001',
      commodity_group: 'COLD BEVERAGES',
    },
    {
      prod_id: '2001',
      description: 'Croissant Plain',
      commodity_group_id: 'BRP_001',
      commodity_group: 'BREAD PRODUCTS',
    },
    {
      prod_id: '2002',
      description: 'Chocolate Muffin',
      commodity_group_id: 'CFY_001',
      commodity_group: 'CONFECTIONERY',
    },
    {
      prod_id: '2003',
      description: 'Baguette',
      commodity_group_id: 'BRP_001',
      commodity_group: 'BREAD PRODUCTS',
    },
    {
      prod_id: '2004',
      description: 'Donut Glazed',
      commodity_group_id: 'CFY_001',
      commodity_group: 'CONFECTIONERY',
    },
    {
      prod_id: '2005',
      description: 'Whole Wheat Bread',
      commodity_group_id: 'BRP_001',
      commodity_group: 'BREAD PRODUCTS',
    },
    {
      prod_id: '2006',
      description: 'Cinnamon Roll',
      commodity_group_id: 'CFY_001',
      commodity_group: 'CONFECTIONERY',
    },
    {
      prod_id: '3001',
      description: 'Lays Salted',
      commodity_group_id: 'CAS_001',
      commodity_group: 'CRISPS AND SNACKS',
    },
    {
      prod_id: '3002',
      description: 'KitKat Chunky',
      commodity_group_id: 'SWP_001',
      commodity_group: 'SWEET PRODUCTS',
    },
    {
      prod_id: '3003',
      description: 'Pringles Original',
      commodity_group_id: 'CAS_001',
      commodity_group: 'CRISPS AND SNACKS',
    },
    {
      prod_id: '3004',
      description: 'Mars Bar',
      commodity_group_id: 'SWP_001',
      commodity_group: 'SWEET PRODUCTS',
    },
    {
      prod_id: '3005',
      description: 'Doritos Nacho',
      commodity_group_id: 'CAS_001',
      commodity_group: 'CRISPS AND SNACKS',
    },
    {
      prod_id: '3006',
      description: 'Snickers Bar',
      commodity_group_id: 'SWP_001',
      commodity_group: 'SWEET PRODUCTS',
    },
    {
      prod_id: '4001',
      description: 'Sandwich Ham & Cheese',
      commodity_group_id: 'SND_001',
      commodity_group: 'SANDWICHES',
    },
    {
      prod_id: '4002',
      description: 'Turkey Sandwich',
      commodity_group_id: 'SND_001',
      commodity_group: 'SANDWICHES',
    },
    {
      prod_id: '4003',
      description: 'Veggie Wrap',
      commodity_group_id: 'SND_001',
      commodity_group: 'SANDWICHES',
    },
    {
      prod_id: '5001',
      description: 'Espresso Beans 1kg',
      commodity_group_id: 'HBV_001',
      commodity_group: 'HOT BEVERAGES',
    },
    {
      prod_id: '5002',
      description: 'Sugar Sticks',
      commodity_group_id: 'HBV_001',
      commodity_group: 'HOT BEVERAGES',
    },
    {
      prod_id: '5003',
      description: 'Coffee Beans Premium',
      commodity_group_id: 'HBV_001',
      commodity_group: 'HOT BEVERAGES',
    },
    {
      prod_id: '5004',
      description: 'Tea Bags Earl Grey',
      commodity_group_id: 'HBV_001',
      commodity_group: 'HOT BEVERAGES',
    },
    {
      prod_id: '5005',
      description: 'Hot Chocolate Mix',
      commodity_group_id: 'HBV_001',
      commodity_group: 'HOT BEVERAGES',
    },
    {
      prod_id: '6001',
      description: 'Milk 1L',
      commodity_group_id: 'DAC_001',
      commodity_group: 'DAIRY AND CHEESE',
    },
    {
      prod_id: '6002',
      description: 'Cheddar Cheese 200g',
      commodity_group_id: 'DAC_001',
      commodity_group: 'DAIRY AND CHEESE',
    },
    {
      prod_id: '6003',
      description: 'Greek Yogurt',
      commodity_group_id: 'DAC_001',
      commodity_group: 'DAIRY AND CHEESE',
    },
    {
      prod_id: '6004',
      description: 'Butter 250g',
      commodity_group_id: 'DAC_001',
      commodity_group: 'DAIRY AND CHEESE',
    },
    {
      prod_id: '7001',
      description: 'Apple',
      commodity_group_id: 'FRV_001',
      commodity_group: 'FRUIT AND VEGETABLES',
    },
    {
      prod_id: '7002',
      description: 'Banana',
      commodity_group_id: 'FRV_001',
      commodity_group: 'FRUIT AND VEGETABLES',
    },
    {
      prod_id: '7003',
      description: 'Tomatoes',
      commodity_group_id: 'FRV_001',
      commodity_group: 'FRUIT AND VEGETABLES',
    },
    {
      prod_id: '7004',
      description: 'Lettuce',
      commodity_group_id: 'FRV_001',
      commodity_group: 'FRUIT AND VEGETABLES',
    },
    {
      prod_id: '8001',
      description: 'Chicken Breast 500g',
      commodity_group_id: 'MET_001',
      commodity_group: 'MEAT',
    },
    {
      prod_id: '8002',
      description: 'Ground Beef 500g',
      commodity_group_id: 'MET_001',
      commodity_group: 'MEAT',
    },
    {
      prod_id: '8003',
      description: 'Bacon 250g',
      commodity_group_id: 'MET_001',
      commodity_group: 'MEAT',
    },
    {
      prod_id: '9001',
      description: 'Salmon Fillet 300g',
      commodity_group_id: 'FAS_001',
      commodity_group: 'FISH AND SEAFOOD',
    },
    {
      prod_id: '9002',
      description: 'Shrimp 400g',
      commodity_group_id: 'FAS_001',
      commodity_group: 'FISH AND SEAFOOD',
    },
    {
      prod_id: '9003',
      description: 'Tuna Can',
      commodity_group_id: 'FAS_001',
      commodity_group: 'FISH AND SEAFOOD',
    },
    {
      prod_id: '10001',
      description: 'White Wine 750ml',
      commodity_group_id: 'ABV_001',
      commodity_group: 'ALCOHOLIC BEVERAGE',
    },
    {
      prod_id: '10002',
      description: 'Red Wine 750ml',
      commodity_group_id: 'ABV_001',
      commodity_group: 'ALCOHOLIC BEVERAGE',
    },
    {
      prod_id: '10003',
      description: 'Beer 6-Pack',
      commodity_group_id: 'ABV_001',
      commodity_group: 'ALCOHOLIC BEVERAGE',
    },
    {
      prod_id: '11001',
      description: 'Pasta 500g',
      commodity_group_id: 'GRA_001',
      commodity_group: 'GROCERIES AMBIENT',
    },
    {
      prod_id: '11002',
      description: 'Rice 1kg',
      commodity_group_id: 'GRA_001',
      commodity_group: 'GROCERIES AMBIENT',
    },
    {
      prod_id: '11003',
      description: 'Olive Oil 500ml',
      commodity_group_id: 'GRA_001',
      commodity_group: 'GROCERIES AMBIENT',
    },
    {
      prod_id: '11004',
      description: 'Tomato Sauce',
      commodity_group_id: 'GRA_001',
      commodity_group: 'GROCERIES AMBIENT',
    },
    {
      prod_id: '12001',
      description: 'Paper Towels',
      commodity_group_id: 'DIS_001',
      commodity_group: 'DISPOSABLES',
    },
    {
      prod_id: '12002',
      description: 'Plastic Cups 50pk',
      commodity_group_id: 'DIS_001',
      commodity_group: 'DISPOSABLES',
    },
    {
      prod_id: '12003',
      description: 'Napkins 100pk',
      commodity_group_id: 'DIS_001',
      commodity_group: 'DISPOSABLES',
    },
    {
      prod_id: '13001',
      description: 'Dish Soap',
      commodity_group_id: 'CLN_001',
      commodity_group: 'CLEANING MATERIALS',
    },
    {
      prod_id: '13002',
      description: 'All-Purpose Cleaner',
      commodity_group_id: 'CLN_001',
      commodity_group: 'CLEANING MATERIALS',
    },
    {
      prod_id: '13003',
      description: 'Sponges 5pk',
      commodity_group_id: 'CLN_001',
      commodity_group: 'CLEANING MATERIALS',
    },
    {
      prod_id: '14001',
      description: 'Gummy Bears',
      commodity_group_id: 'CFY_001',
      commodity_group: 'CONFECTIONERY',
    },
    {
      prod_id: '14002',
      description: 'Chocolate Bar Dark',
      commodity_group_id: 'SWP_001',
      commodity_group: 'SWEET PRODUCTS',
    },
    {
      prod_id: '14003',
      description: 'Lollipops 20pk',
      commodity_group_id: 'CFY_001',
      commodity_group: 'CONFECTIONERY',
    },
    {
      prod_id: '15001',
      description: 'Pretzels 300g',
      commodity_group_id: 'CAS_001',
      commodity_group: 'CRISPS AND SNACKS',
    },
    {
      prod_id: '15002',
      description: 'Popcorn 200g',
      commodity_group_id: 'CAS_001',
      commodity_group: 'CRISPS AND SNACKS',
    },
    {
      prod_id: '15003',
      description: 'Trail Mix 250g',
      commodity_group_id: 'CAS_001',
      commodity_group: 'CRISPS AND SNACKS',
    },
    {
      prod_id: '16001',
      description: 'Ice Cubes 2kg',
      commodity_group_id: 'ICE_001',
      commodity_group: 'ICE CUBES',
    },
    {
      prod_id: '16002',
      description: 'Frozen Pizza',
      commodity_group_id: 'NFR_001',
      commodity_group: 'NON FOOD RETAIL',
    },
    {
      prod_id: '17001',
      description: 'Breakfast Cereal',
      commodity_group_id: 'GRA_001',
      commodity_group: 'GROCERIES AMBIENT',
    },
    {
      prod_id: '17002',
      description: 'Granola Bars 6pk',
      commodity_group_id: 'GRA_001',
      commodity_group: 'GROCERIES AMBIENT',
    },
    {
      prod_id: '17003',
      description: 'Peanut Butter',
      commodity_group_id: 'GRA_001',
      commodity_group: 'GROCERIES AMBIENT',
    },
    {
      prod_id: '17004',
      description: 'Jam Strawberry',
      commodity_group_id: 'GRA_001',
      commodity_group: 'GROCERIES AMBIENT',
    },
    {
      prod_id: '18001',
      description: 'Cookies Chocolate Chip',
      commodity_group_id: 'SWP_001',
      commodity_group: 'SWEET PRODUCTS',
    },
  ];

  // Only insert products that don't exist
  const newProducts = products.filter((p) => !existingIds.includes(p.prod_id));

  if (newProducts.length > 0) {
    await knex('products').insert(newProducts);
    console.log(`Inserted ${newProducts.length} new products.`);
  } else {
    console.log('All seed products already exist, skipping.');
  }
}
