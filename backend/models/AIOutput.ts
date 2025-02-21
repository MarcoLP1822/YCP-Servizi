/**
 * @fileoverview 
 * This file defines the AIOutput model using Drizzle ORM.
 * It maps the AIOutputs table which stores AI-generated content related to uploaded files.
 * 
 * Key features:
 * - Defines a UUID primary key.
 * - Associates each AI output with a file via file_id.
 * - Stores various types of AI-generated content (blurb, description, keywords, etc.).
 * 
 * @dependencies
 * - drizzle-orm/pg-core for table and column definitions.
 * 
 * @notes
 * - Ensure that the application logic maintains the foreign key relationship between AIOutputs and Files.
 */

import { pgTable, uuid, text, timestamp, jsonb } from 'drizzle-orm/pg-core';

export const AIOutputs = pgTable('AIOutputs', {
  output_id: uuid('output_id').primaryKey().defaultRandom(),
  file_id: uuid('file_id').notNull(),
  blurb: text('blurb'),
  description: text('description'),
  keywords: text('keywords'),
  categories: jsonb('categories'),
  foreword: text('foreword'),
  analysis: text('analysis'),
  generated_at: timestamp('generated_at').defaultNow(),
});
