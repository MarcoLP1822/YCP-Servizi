/**
 * @fileoverview 
 * This file defines the User model using Drizzle ORM.
 * It maps the Users table schema from the database.
 * 
 * Key features:
 * - Defines a UUID primary key with a default random value.
 * - Specifies username, hashed_password, and email as required fields.
 * - Includes created_at and updated_at timestamps.
 * 
 * @dependencies
 * - drizzle-orm/pg-core for table and column definitions.
 * 
 * @notes
 * - Ensure the pgcrypto extension is enabled in PostgreSQL for gen_random_uuid().
 * - Unique constraints on username and email are enforced at the database level.
 */

import { pgTable, uuid, varchar, timestamp } from 'drizzle-orm/pg-core';

export const Users = pgTable('Users', {
  user_id: uuid('user_id').primaryKey().defaultRandom(),
  username: varchar('username', { length: 255 }).notNull(),
  hashed_password: varchar('hashed_password', { length: 255 }).notNull(),
  email: varchar('email', { length: 255 }).notNull(),
  created_at: timestamp('created_at').defaultNow(),
  updated_at: timestamp('updated_at').defaultNow(),
});
