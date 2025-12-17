import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  const exists = await knex.schema.hasTable('widgets');
  if (exists) {
    console.log('Table "widgets" already exists, skipping creation.');
    return;
  }

  await knex.schema.createTable('widgets', (table) => {
    table.uuid('id').primary().defaultTo(knex.raw('gen_random_uuid()'));
    table.integer('x').notNullable();
    table.integer('y').notNullable();
    table.integer('width').notNullable();
    table.integer('height').notNullable();
    table.uuid('user_id').notNullable().references('id').inTable('users').onDelete('CASCADE');
    table.string('type', 50).notNullable();
    table.timestamp('created_at').defaultTo(knex.fn.now());
    table.timestamp('updated_at').defaultTo(knex.fn.now());

    table.unique(['user_id', 'type'], { indexName: 'uq_widget_user_type' });
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTableIfExists('widgets');
}
