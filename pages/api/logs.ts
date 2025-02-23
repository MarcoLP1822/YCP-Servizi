/**
 * @fileoverview
 * This API endpoint handles logging user actions.
 * It supports two methods:
 * - POST: Records a new log entry using the provided user_id, action_type, description, and optional metadata.
 * - GET: Retrieves all log entries from the Logs table, ordered by timestamp (most recent first).
 *
 * @dependencies
 * - backend/services/logService.ts: Used for recording log entries (POST).
 * - backend/models/Log.ts: The Logs model for interacting with the Logs table.
 * - backend/db.ts: The database connection instance for querying logs.
 * - types/api.d.ts: Provides type definitions for the API responses.
 *
 * @notes
 * - GET requests will return a JSON object with a "logs" field containing an array of log entries.
 * - POST requests require the fields: user_id, action_type, and description.
 * - In case of errors, appropriate status codes and error messages are returned.
 */

import type { NextApiRequest, NextApiResponse } from 'next';
import { recordLog } from '../../backend/services/logService';
import { db } from '../../backend/db';
import { Logs } from '../../backend/models/Log';
// Import the helper for descending order from Drizzle ORM.
import { desc } from 'drizzle-orm';
import type { ApiResponse, LogResponse } from '../../types/api';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ApiResponse<LogResponse | { logs: any[] }>>
) {
  if (req.method === 'GET') {
    // Handle GET requests: Retrieve all log entries ordered by timestamp (latest first)
    try {
      // Query the Logs table and order by the timestamp field in descending order using the `desc` helper.
      const logs = await db.select().from(Logs).orderBy(desc(Logs.timestamp));
      return res.status(200).json({
        message: 'Logs recuperati con successo.',
        data: { logs },
      });
    } catch (error: unknown) {
      console.error('Errore nel recupero dei logs:', error);
      return res.status(500).json({
        message: '',
        error: 'Errore interno del server durante il recupero dei logs.',
      });
    }
  } else if (req.method === 'POST') {
    // Handle POST requests: Record a new log entry.
    try {
      const { user_id, action_type, description, metadata } = req.body;

      // Validate that the required fields are provided.
      if (!user_id || !action_type || !description) {
        return res.status(400).json({
          message: '',
          error: 'Campi "user_id", "action_type" e "description" sono obbligatori.',
        });
      }

      // Record the log entry using the recordLog service function.
      const logEntry = await recordLog(user_id, action_type, description, metadata);

      return res.status(200).json({
        message: 'Log registrato con successo.',
        data: { log: logEntry },
      });
    } catch (error: unknown) {
      console.error('Errore nella registrazione del log:', error);
      return res.status(500).json({
        message: '',
        error: 'Errore interno del server durante la registrazione del log.',
      });
    }
  } else {
    // If the request method is not GET or POST, return a 405 error.
    return res.status(405).json({ message: '', error: 'Metodo non consentito. Utilizzare GET o POST.' });
  }
}
