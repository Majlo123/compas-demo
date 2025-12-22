import { Knex } from 'knex';

export async function seed(knex: Knex): Promise<void> {
  // Check if users already exist (avoid duplicates)
  const existingWarningLevels = await knex('warning_level').select('name');
  const existingNames = existingWarningLevels.map(u => u.name);

  const warningLevels = [
    { name: 'Warning level 1', description: 'warning level 1 description' },
    { name: 'Warning level 2', description: 'warning level 2 description' },
    { name: 'Warning level 3', description: 'warning level 3 description' },
    { name: 'Warning level 4', description: 'warning level 4 description' },
    { name: 'Warning level 5', description: 'warning level 5 description' },

  ];

  // Only insert users that don't exist
  const newWarningLevels = warningLevels.filter(u => !existingNames.includes(u.name));

  if (newWarningLevels.length > 0) {
    await knex('warning_level').insert(newWarningLevels);
    console.log(`Inserted ${newWarningLevels.length} new warning levels.`);
  } else {
    console.log('All seed users already exist, skipping.');
  }
}
