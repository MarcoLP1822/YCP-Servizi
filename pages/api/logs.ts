/**
 * @fileoverview
 * This API endpoint handles logging of user actions.
 * It accepts a POST request with the following JSON body:
 * {
 *   "user_id": "string",
 *   "action_type": "string",
 *   "description": "string",
 *   "metadata": { ... } // Optional additional metadata
 * }
 *
 * The endpoint uses the logService to record the log entry in the database.
 *
 * @dependencies
 * - backend/services/logService.ts: Provides the recordLog function.
 *
 * @notes
 * - Only POST requests are allowed.
 * - Proper error handling and validation are implemented.
 */

import type { NextApiRequest, NextApiResponse } from 'next';
import { recordLog } from '../../backend/services/logService';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  // Allow only POST requests for logging
  if (req.method !== 'POST') {
    return res
      .status(405)
      .json({ error: 'Metodo non consentito. Utilizzare POST.' });
  }

  try {
    const { user_id, action_type, description, metadata } = req.body;

    // Validate required fields
    if (!user_id || !action_type || !description) {
      return res.status(400).json({
        error: 'Campi "user_id", "action_type" e "description" sono obbligatori.',
      });
    }

    // Record the log entry using the log service, including optional metadata if provided
    const logEntry = await recordLog(user_id, action_type, description, metadata);

    return res.status(200).json({
      message: 'Log registrato con successo.',
      log: logEntry,
    });
  } catch (error: any) {
    console.error('Errore nella registrazione del log:', error);
    return res.status(500).json({
      error: 'Errore interno del server durante la registrazione del log.',
    });
  }
}
