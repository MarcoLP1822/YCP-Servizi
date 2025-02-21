/**
 * @fileoverview 
 * This file defines the SessionHistory model using Drizzle ORM.
 * It maps the SessionHistory table for storing user session actions and history.
 * 
 * Key features:
 * - Defines a UUID primary key.
 * - Associates session records with a user and a file.
 * - Stores session actions as JSON data.
 * 
 * @dependencies
 * - drizzle-orm/pg-core for table and column definitions.
 * 
 * @notes
 * - Session actions should be structured as JSON to maintain consistency.
 */

import { pgTable, uuid, jsonb, timestamp } from 'drizzle-orm/pg-core';

export const SessionHistory = pgTable('SessionHistory', {
  session_id: uuid('session_id').primaryKey().defaultRandom(),
  user_id: uuid('user_id').notNull(),
  file_id: uuid('file_id').notNull(),
  actions: jsonb('actions'),
  session_date: timestamp('session_date').defaultNow(),
});
