/**
 * @fileoverview
 * Questo endpoint API gestisce la sessione utente.
 * Supporta due metodi:
 * - POST: Registra una nuova sessione utilizzando l'ID dell'utente autenticato e i dati del file.
 * - GET: Recupera le sessioni per l'utente autenticato.
 * 
 * Ora, l'endpoint richiede l'autenticazione tramite il middleware withAuth.
 *
 * @dependencies
 * - backend/services/logService.ts per registrare e recuperare la sessione.
 * - backend/middleware/authMiddleware.ts per l'autenticazione.
 *
 * @notes
 * - Gli errori sono gestiti con "unknown" per conformarsi alle regole ESLint.
 */

import type { NextApiRequest, NextApiResponse } from 'next';
import { recordSessionHistory, getSessionHistory } from '../../backend/services/logService';
import { withAuth, AuthenticatedNextApiRequest } from '../../backend/middleware/authMiddleware';

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const authReq = req as AuthenticatedNextApiRequest; // Type cast to include user information

  if (req.method === 'POST') {
    try {
      // In POST, we no longer expect "user_id" in the body, since we use the authenticated user.
      const { file_id, actions } = req.body;

      // Validate required fields for session creation
      if (!file_id || !actions) {
        return res.status(400).json({
          error: 'Campi "file_id" e "actions" sono obbligatori per creare una sessione.',
        });
      }

      // Record the session history using the authenticated user's ID
      const sessionRecord = await recordSessionHistory(authReq.user.user_id, file_id, actions);

      return res.status(200).json({
        message: 'Sessione registrata con successo.',
        session: sessionRecord,
      });
    } catch (error: unknown) {
      console.error('Errore nella registrazione della sessione:', error);
      return res.status(500).json({
        error: 'Errore interno del server durante la registrazione della sessione.',
      });
    }
  } else if (req.method === 'GET') {
    try {
      // Retrieve session history for the authenticated user
      const sessions = await getSessionHistory(authReq.user.user_id);

      return res.status(200).json({
        message: 'Sessione recuperata con successo.',
        sessions,
      });
    } catch (error: unknown) {
      console.error('Errore nel recupero della sessione:', error);
      return res.status(500).json({
        error: 'Errore interno del server durante il recupero della sessione.',
      });
    }
  } else {
    return res.status(405).json({ error: 'Metodo non consentito. Utilizzare GET o POST.' });
  }
};

export default withAuth(handler);
