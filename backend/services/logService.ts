/**
 * @fileoverview
 * This module provides utility functions to handle logging and session management.
 * It includes functions to record log entries (e.g., for actions such as file upload,
 * AI generation, editing, sharing) and to manage session history records.
 *
 * Key features:
 * - recordLog: Inserts a log record into the Logs table with detailed metadata.
 * - recordSessionHistory: Inserts a session history record into the SessionHistory table.
 * - getSessionHistory: Retrieves session history records for a specific user.
 *
 * @dependencies
 * - Drizzle ORM for database operations.
 * - The Logs and SessionHistory models.
 * - The database connection instance from backend/db.ts.
 *
 * @notes
 * - All functions use try-catch blocks to handle and log errors.
 * - The session actions are stored as JSON for flexibility.
 */

import { db } from '../db';
import { Logs } from '../models/Log';
import { SessionHistory } from '../models/SessionHistory';
import { eq } from 'drizzle-orm';

/**
 * Inserts a log entry into the Logs table.
 *
 * @param userId - The unique identifier of the user performing the action.
 * @param actionType - A brief string describing the type of action (e.g., "upload", "generate", "edit", "share").
 * @param description - A detailed description of the action performed.
 * @param metadata - Optional additional metadata providing context for the log entry.
 * @returns A promise that resolves to the inserted log record.
 */
export async function recordLog(
  userId: string,
  actionType: string,
  description: string,
  metadata?: object
): Promise<any> {
  try {
    const result = await db
      .insert(Logs)
      .values({
        user_id: userId,
        action_type: actionType,
        description: description,
        metadata: metadata || null,
      })
      .returning();
    return result[0];
  } catch (error) {
    console.error('Error recording log:', error);
    throw new Error('Unable to record log entry.');
  }
}

/**
 * Inserts a session history record into the SessionHistory table.
 *
 * @param userId - The unique identifier of the user.
 * @param fileId - The unique identifier of the file associated with the session.
 * @param actions - A JSON object representing the actions taken during the session.
 * @returns A promise that resolves to the inserted session history record.
 */
export async function recordSessionHistory(
  userId: string,
  fileId: string,
  actions: object
): Promise<any> {
  try {
    const result = await db
      .insert(SessionHistory)
      .values({
        user_id: userId,
        file_id: fileId,
        actions: actions,
      })
      .returning();
    return result[0];
  } catch (error) {
    console.error('Error recording session history:', error);
    throw new Error('Unable to record session history.');
  }
}

/**
 * Retrieves session history records for a given user.
 *
 * @param userId - The unique identifier of the user.
 * @returns A promise that resolves to an array of session history records for the specified user.
 */
export async function getSessionHistory(userId: string): Promise<any[]> {
  try {
    const records = await db
      .select()
      .from(SessionHistory)
      .where(eq(SessionHistory.user_id, userId));
    return records;
  } catch (error) {
    console.error('Error fetching session history:', error);
    throw new Error('Unable to retrieve session history.');
  }
}
