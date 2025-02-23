/**
 * @fileoverview
 * This API endpoint manages user session data.
 * It supports:
 * - POST: Recording a new session using the authenticated user's ID along with file and action data.
 * - GET: Retrieving session history for the authenticated user.
 *
 * @dependencies
 * - backend/services/logService.ts for recording and retrieving session history.
 * - backend/middleware/authMiddleware.ts for authentication.
 * - types/api.d.ts for API response types.
 */

import type { NextApiRequest, NextApiResponse } from 'next';
import { recordSessionHistory, getSessionHistory } from '../../backend/services/logService';
import { withAuth, AuthenticatedNextApiRequest } from '../../backend/middleware/authMiddleware';
import type { ApiResponse, SessionResponse } from '../../types/api';

const handler = async (req: NextApiRequest, res: NextApiResponse<ApiResponse<SessionResponse>>) => {
  const authReq = req as AuthenticatedNextApiRequest;

  if (req.method === 'POST') {
    try {
      const { file_id, actions } = req.body;

      if (!file_id || !actions) {
        return res.status(400).json({
          message: '',
          error: 'Campi "file_id" e "actions" sono obbligatori per creare una sessione.',
        });
      }

      const sessionRecord = await recordSessionHistory(authReq.user.user_id, file_id, actions);

      return res.status(200).json({
        message: 'Sessione registrata con successo.',
        data: { session: sessionRecord },
      });
    } catch (error: unknown) {
      console.error('Errore nella registrazione della sessione:', error);
      return res.status(500).json({
        message: '',
        error: 'Errore interno del server durante la registrazione della sessione.',
      });
    }
  } else if (req.method === 'GET') {
    try {
      const sessions = await getSessionHistory(authReq.user.user_id);

      return res.status(200).json({
        message: 'Sessione recuperata con successo.',
        data: { sessions },
      });
    } catch (error: unknown) {
      console.error('Errore nel recupero della sessione:', error);
      return res.status(500).json({
        message: '',
        error: 'Errore interno del server durante il recupero della sessione.',
      });
    }
  } else {
    return res.status(405).json({ message: '', error: 'Metodo non consentito. Utilizzare GET o POST.' });
  }
};

export default withAuth(handler);
