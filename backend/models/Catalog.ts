/**
 * @fileoverview 
 * This file defines the Catalog model using Drizzle ORM.
 * It maps the Catalog table for storing category data used for book classification.
 * 
 * Key features:
 * - Defines a UUID primary key.
 * - Stores category data as JSON.
 * - Includes a timestamp for when the catalog was last updated.
 * 
 * @dependencies
 * - drizzle-orm/pg-core for table and column definitions.
 * 
 * @notes
 * - The JSON structure should match the expected format for the catalog.
 */

import { pgTable, uuid, jsonb, timestamp } from 'drizzle-orm/pg-core';

export const Catalog = pgTable('Catalog', {
  catalog_id: uuid('catalog_id').primaryKey().defaultRandom(),
  category_data: jsonb('category_data').notNull(),
  last_updated: timestamp('last_updated').defaultNow(),
});
