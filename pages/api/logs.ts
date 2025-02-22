/**
 * @fileoverview
 * Questo endpoint API gestisce la registrazione dei log degli utenti.
 * Riceve una richiesta POST con user_id, action_type, description e opzionalmente metadata,
 * e registra il log nel database.
 *
 * @dependencies
 * - backend/services/logService.ts per la registrazione del log.
 *
 * @notes
 * - Gli errori sono gestiti con "unknown" per conformarsi alle regole ESLint.
 */

import type { NextApiRequest, NextApiResponse } from 'next';
import { recordLog } from '../../backend/services/logService';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  // Allow only POST requests for logging
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Metodo non consentito. Utilizzare POST.' });
  }

  try {
    const { user_id, action_type, description, metadata } = req.body;

    // Validate required fields
    if (!user_id || !action_type || !description) {
      return res.status(400).json({
        error: 'Campi "user_id", "action_type" e "description" sono obbligatori.',
      });
    }

    // Record the log entry
    const logEntry = await recordLog(user_id, action_type, description, metadata);

    return res.status(200).json({
      message: 'Log registrato con successo.',
      log: logEntry,
    });
  } catch (error: unknown) {
    console.error('Errore nella registrazione del log:', error);
    return res.status(500).json({
      error: 'Errore interno del server durante la registrazione del log.',
    });
  }
}
