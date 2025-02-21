/**
 * @fileoverview 
 * This file defines the Log model using Drizzle ORM.
 * It maps the Logs table for recording user actions and events.
 * 
 * Key features:
 * - Defines a UUID primary key.
 * - Stores log details such as action type and description.
 * - Automatically timestamps log entries.
 * 
 * @dependencies
 * - drizzle-orm/pg-core for table and column definitions.
 * 
 * @notes
 * - Proper indexing on user_id is recommended for efficient log querying.
 */

import { pgTable, uuid, varchar, text, timestamp } from 'drizzle-orm/pg-core';

export const Logs = pgTable('Logs', {
  log_id: uuid('log_id').primaryKey().defaultRandom(),
  user_id: uuid('user_id').notNull(),
  action_type: varchar('action_type', { length: 100 }).notNull(),
  description: text('description'),
  timestamp: timestamp('timestamp').defaultNow(),
});
