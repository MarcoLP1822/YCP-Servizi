/**
 * @fileoverview
 * This API endpoint manages session history.
 * It supports two methods:
 * - POST: Record a new session history entry with the provided user_id, file_id, and actions.
 * - GET: Retrieve session history entries for a specific user by passing user_id as a query parameter.
 *
 * @dependencies
 * - backend/services/logService.ts: Provides the recordSessionHistory and getSessionHistory functions.
 *
 * @notes
 * - Ensure that the incoming request contains all necessary fields.
 * - Only authenticated users should ideally access this endpoint (authentication middleware can be added later).
 */

import type { NextApiRequest, NextApiResponse } from 'next';
import { recordSessionHistory, getSessionHistory } from '../../backend/services/logService';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === 'POST') {
    try {
      const { user_id, file_id, actions } = req.body;

      // Validate required fields for session creation
      if (!user_id || !file_id || !actions) {
        return res.status(400).json({
          error: 'Campi "user_id", "file_id" e "actions" sono obbligatori per creare una sessione.',
        });
      }

      // Record the session history using the log service
      const sessionRecord = await recordSessionHistory(user_id, file_id, actions);

      return res.status(200).json({
        message: 'Sessione registrata con successo.',
        session: sessionRecord,
      });
    } catch (error: any) {
      console.error('Errore nella registrazione della sessione:', error);
      return res.status(500).json({
        error: 'Errore interno del server durante la registrazione della sessione.',
      });
    }
  } else if (req.method === 'GET') {
    try {
      // Expect user_id as query parameter to fetch session history
      const { user_id } = req.query;
      if (!user_id || typeof user_id !== 'string') {
        return res.status(400).json({
          error: 'Parametro "user_id" mancante o non valido.',
        });
      }

      // Retrieve session history records for the specified user
      const sessions = await getSessionHistory(user_id);

      return res.status(200).json({
        message: 'Sessione recuperata con successo.',
        sessions,
      });
    } catch (error: any) {
      console.error('Errore nel recupero della sessione:', error);
      return res.status(500).json({
        error: 'Errore interno del server durante il recupero della sessione.',
      });
    }
  } else {
    return res
      .status(405)
      .json({ error: 'Metodo non consentito. Utilizzare GET o POST.' });
  }
}
