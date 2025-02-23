/**
 * @fileoverview
 * This API endpoint handles logging user actions.
 * It expects a POST request with user_id, action_type, description, and optionally metadata,
 * and records the log entry in the database.
 *
 * @dependencies
 * - backend/services/logService.ts for recording the log.
 * - types/api.d.ts for API response types.
 */

import type { NextApiRequest, NextApiResponse } from 'next';
import { recordLog } from '../../backend/services/logService';
import type { ApiResponse, LogResponse } from '../../types/api';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ApiResponse<LogResponse>>
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: '', error: 'Metodo non consentito. Utilizzare POST.' });
  }

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
