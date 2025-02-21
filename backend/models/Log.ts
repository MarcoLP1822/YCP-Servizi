/**
 * @fileoverview 
 * This file defines the Log model using Drizzle ORM.
 * It maps the Logs table for recording user actions and events with detailed metadata.
 * 
 * Key features:
 * - Defines a UUID primary key.
 * - Stores log details such as action type, description, and optional metadata.
 * - Automatically timestamps log entries.
 * 
 * @dependencies
 * - drizzle-orm/pg-core for table and column definitions.
 * 
 * @notes
 * - The new 'metadata' column allows storing extra contextual information in JSON format.
 * - Proper indexing on user_id is recommended for efficient log querying.
 */

import { pgTable, uuid, varchar, text, timestamp, jsonb } from 'drizzle-orm/pg-core';

export const Logs = pgTable('Logs', {
  log_id: uuid('log_id').primaryKey().defaultRandom(),
  user_id: uuid('user_id').notNull(),
  action_type: varchar('action_type', { length: 100 }).notNull(),
  description: text('description'),
  // New column for storing additional metadata as JSON.
  metadata: jsonb('metadata'),
  timestamp: timestamp('timestamp').defaultNow(),
});
