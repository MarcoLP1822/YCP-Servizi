/**
 * @fileoverview 
 * This file defines the File model using Drizzle ORM.
 * It represents the Files table for storing uploaded file metadata.
 * 
 * Key features:
 * - Defines a UUID primary key.
 * - Stores file metadata such as file name, type, size, and storage path.
 * - Includes a processing_status field defined as an enum.
 * 
 * @dependencies
 * - drizzle-orm/pg-core for table and column definitions.
 * 
 * @notes
 * - The processing_status enum matches the database enum definition.
 */

import { pgTable, uuid, varchar, integer, timestamp, pgEnum } from 'drizzle-orm/pg-core';

// Define the enum for processing_status to match ('pending', 'processing', 'complete', 'error')
export const processingStatusEnum = pgEnum('processing_status', ['pending', 'processing', 'complete', 'error']);

export const Files = pgTable('Files', {
  file_id: uuid('file_id').primaryKey().defaultRandom(),
  user_id: uuid('user_id').notNull(),
  file_name: varchar('file_name', { length: 255 }).notNull(),
  file_type: varchar('file_type', { length: 50 }).notNull(),
  file_size: integer('file_size').notNull(),
  storage_path: varchar('storage_path', { length: 255 }).notNull(),
  upload_date: timestamp('upload_date').defaultNow(),
  // Use the defined enum for processing_status with a default value of 'pending'
  processing_status: processingStatusEnum('processing_status').default('pending').notNull(),
});
