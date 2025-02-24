/**
 * @fileoverview
 * This API endpoint handles logging user actions.
 * It supports:
 * - POST: To record a new log entry.
 * - GET: To retrieve all log entries ordered by timestamp (most recent first).
 *
 * @dependencies
 * - backend/services/logService.ts for recording logs (POST).
 * - backend/db.ts and backend/models/Log.ts for querying logs (GET).
 * - types/api.d.ts for API response types.
 */

import type { NextApiRequest, NextApiResponse } from 'next';
import { recordLog } from '../../backend/services/logService';
import type { ApiResponse, LogResponse } from '../../types/api';
import { db } from '../../backend/db';
import { Logs } from '../../backend/models/Log';
import { desc } from 'drizzle-orm';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ApiResponse<LogResponse> | ApiResponse<{ logs: any[] }>>
) {
  // Handle GET requests: Retrieve and return all log entries ordered by timestamp.
  if (req.method === 'GET') {
    try {
      // Query the Logs table and order by timestamp in descending order (most recent first)
      const logs = await db.select().from(Logs).orderBy(Logs.timestamp, desc);
      return res.status(200).json({
        message: 'Log recuperati con successo.',
        data: { logs },
      });
    } catch (error: unknown) {
      console.error('Errore nel recupero dei log:', error);
      return res.status(500).json({
        message: '',
        error: 'Errore interno del server durante il recupero dei log.',
      });
    }
  }

  // Handle POST requests: Record a new log entry.
  if (req.method === 'POST') {
    try {
      const { user_id, action_type, description, metadata } = req.body;

      if (!user_id || !action_type || !description) {
        return res.status(400).json({
          message: '',
          error: 'Campi "user_id", "action_type" e "description" sono obbligatori.',
        });
      }

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
  }

  // If the method is neither GET nor POST, return a 405 error.
  return res.status(405).json({ message: '', error: 'Metodo non consentito. Utilizzare GET o POST.' });
}
