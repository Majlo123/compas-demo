import { Knex } from 'knex';

export async function seed(knex: Knex): Promise<void> {
  // Check if products already exist (avoid duplicates)
  const existingProducts = await knex('products').select('prod_id');
  const existingProdIds = existingProducts.map((p) => p.prod_id);

  const products = [
    {
      prod_id: '100806',
      description: 'Lemon Zest 0-2mm 060 10KG',
      commodity_group_id: 'FRUIT',
      commodity_group: 'FRUIT AND VEGETABLES',
    },
    {
      prod_id: '101916',
      description: 'Absorbit',
      commodity_group_id: 'GROCERIES',
      commodity_group: 'GROCERIES AMBIENT',
    },
    {
      prod_id: '102392',
      description: 'Agar Agar - 200G',
      commodity_group_id: 'GROCERIES',
      commodity_group: 'GROCERIES AMBIENT',
    },
    {
      prod_id: '102394',
      description: 'Apple Pie Flavour Drop',
      commodity_group_id: 'GROCERIES',
      commodity_group: 'GROCERIES AMBIENT',
    },
    {
      prod_id: '102395',
      description: 'Apple Sherbet - 500Gr',
      commodity_group_id: 'GROCERIES',
      commodity_group: 'GROCERIES AMBIENT',
    },
    {
      prod_id: '102396',
      description: 'Vitamin Ascorbic Acid 500g',
      commodity_group_id: 'GROCERIES',
      commodity_group: 'GROCERIES AMBIENT',
    },
    {
      prod_id: '102397',
      description: 'Baked Bread Flavour Drop',
      commodity_group_id: 'GROCERIES',
      commodity_group: 'GROCERIES AMBIENT',
    },
    {
      prod_id: '102399',
      description: 'Basil Flavour Drop - 30Ml',
      commodity_group_id: 'GROCERIES',
      commodity_group: 'GROCERIES AMBIENT',
    },
    {
      prod_id: '102201',
      description: 'Bergamot Heat Stable Concentrate 200G',
      commodity_group_id: 'GROCERIES',
      commodity_group: 'GROCERIES AMBIENT',
    },
    {
      prod_id: '102203',
      description: 'Blackberry Freeze Dried Fruits - 200Gr',
      commodity_group_id: 'GROCERIES',
      commodity_group: 'GROCERIES AMBIENT',
    },
    {
      prod_id: '102205',
      description: 'Blueberry Flavour Drop - 30Ml',
      commodity_group_id: 'GROCERIES',
      commodity_group: 'GROCERIES AMBIENT',
    },
    {
      prod_id: '102208',
      description: 'Blueberry Pieces Freeze Dried Fruit',
      commodity_group_id: 'GROCERIES',
      commodity_group: 'GROCERIES AMBIENT',
    },
    {
      prod_id: '102207',
      description: 'Bramley Apple Flavour Drop - 30Ml',
      commodity_group_id: 'GROCERIES',
      commodity_group: 'GROCERIES AMBIENT',
    },
    {
      prod_id: '102209',
      description: 'Brandy Flavour Drop 30Ml',
      commodity_group_id: 'GROCERIES',
      commodity_group: 'GROCERIES AMBIENT',
    },
    {
      prod_id: '102212',
      description: 'Calcium Lactate 200G',
      commodity_group_id: 'GROCERIES',
      commodity_group: 'GROCERIES AMBIENT',
    },
    {
      prod_id: '102213',
      description: 'Caramel Popcorn Flavour Drop 30Ml',
      commodity_group_id: 'GROCERIES',
      commodity_group: 'GROCERIES AMBIENT',
    },
    {
      prod_id: '102214',
      description: 'Carrageenan Kappa 200G',
      commodity_group_id: 'GROCERIES',
      commodity_group: 'GROCERIES AMBIENT',
    },
    {
      prod_id: '102215',
      description: 'Cherry Flavour Drop - 30Ml',
      commodity_group_id: 'GROCERIES',
      commodity_group: 'GROCERIES AMBIENT',
    },
    {
      prod_id: '102216',
      description: 'Chocolate Flavour Drop - 30Ml',
      commodity_group_id: 'GROCERIES',
      commodity_group: 'GROCERIES AMBIENT',
    },
    {
      prod_id: '102217',
      description: 'Cinnamon Flavour Drop - 30Ml',
      commodity_group_id: 'GROCERIES',
      commodity_group: 'GROCERIES AMBIENT',
    },
    {
      prod_id: '102218',
      description: 'Citric Acid - 500G',
      commodity_group_id: 'GROCERIES',
      commodity_group: 'GROCERIES AMBIENT',
    },
    {
      prod_id: '102219',
      description: 'Coconut Flavour Drop - 30Ml',
      commodity_group_id: 'GROCERIES',
      commodity_group: 'GROCERIES AMBIENT',
    },
    {
      prod_id: '102220',
      description: 'Coffee Flavour Drop - 30Ml',
      commodity_group_id: 'GROCERIES',
      commodity_group: 'GROCERIES AMBIENT',
    },
    {
      prod_id: '102221',
      description: 'Freeze Dried Raspberry Powder - 200G',
      commodity_group_id: 'GROCERIES',
      commodity_group: 'GROCERIES AMBIENT',
    },
    {
      prod_id: '102222',
      description: 'Freeze Dried Strawberry Powder - 200G',
      commodity_group_id: 'GROCERIES',
      commodity_group: 'GROCERIES AMBIENT',
    },
    {
      prod_id: '102223',
      description: 'Ginger Flavour Drop - 30Ml',
      commodity_group_id: 'GROCERIES',
      commodity_group: 'GROCERIES AMBIENT',
    },
    {
      prod_id: '102224',
      description: 'Glucose Powder - 1KG',
      commodity_group_id: 'GROCERIES',
      commodity_group: 'GROCERIES AMBIENT',
    },
  ];

  // Only insert products that don't exist
  const newProducts = products.filter((p) => !existingProdIds.includes(p.prod_id));

  if (newProducts.length > 0) {
    await knex('products').insert(newProducts);
    console.log(`Inserted ${newProducts.length} new products.`);
  } else {
    console.log('All seed products already exist, skipping.');
  }
}
