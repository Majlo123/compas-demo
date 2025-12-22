import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  // Ensure index on live_stock.prod_id (PK already indexed, but add explicit index for clarity)
  await knex.schema.raw(
    'CREATE INDEX IF NOT EXISTS idx_live_stock_prod_id ON live_stock(prod_id)'
  );

  // Ensure index on par_level.warning_level_id
  await knex.schema.raw(
    'CREATE INDEX IF NOT EXISTS idx_par_level_warning_level_id ON par_level(warning_level_id)'
  );

  // Ensure FK live_stock.prod_id -> products.prod_id
  await knex.schema.raw(`
    DO $$
    BEGIN
      IF NOT EXISTS (
        SELECT 1 FROM information_schema.table_constraints
        WHERE constraint_name = 'live_stock_prod_id_fk'
          AND table_name = 'live_stock'
      ) THEN
        ALTER TABLE live_stock
          ADD CONSTRAINT live_stock_prod_id_fk
          FOREIGN KEY (prod_id) REFERENCES products(prod_id);
      END IF;
    END$$;
  `);

  // Ensure FK par_level.prod_id -> live_stock.prod_id
  await knex.schema.raw(`
    DO $$
    BEGIN
      IF NOT EXISTS (
        SELECT 1 FROM information_schema.table_constraints
        WHERE constraint_name = 'par_level_prod_id_fk'
          AND table_name = 'par_level'
      ) THEN
        ALTER TABLE par_level
          ADD CONSTRAINT par_level_prod_id_fk
          FOREIGN KEY (prod_id) REFERENCES live_stock(prod_id);
      END IF;
    END$$;
  `);

  // Ensure FK par_level.warning_level_id -> warning_level.id
  await knex.schema.raw(`
    DO $$
    BEGIN
      IF NOT EXISTS (
        SELECT 1 FROM information_schema.table_constraints
        WHERE constraint_name = 'par_level_warning_level_fk'
          AND table_name = 'par_level'
      ) THEN
        ALTER TABLE par_level
          ADD CONSTRAINT par_level_warning_level_fk
          FOREIGN KEY (warning_level_id) REFERENCES warning_level(id);
      END IF;
    END$$;
  `);
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.raw('DROP INDEX IF EXISTS idx_live_stock_prod_id');
  await knex.schema.raw('DROP INDEX IF EXISTS idx_par_level_warning_level_id');
  await knex.schema.raw('ALTER TABLE live_stock DROP CONSTRAINT IF EXISTS live_stock_prod_id_fk');
  await knex.schema.raw('ALTER TABLE par_level DROP CONSTRAINT IF EXISTS par_level_prod_id_fk');
  await knex.schema.raw('ALTER TABLE par_level DROP CONSTRAINT IF EXISTS par_level_warning_level_fk');
}
