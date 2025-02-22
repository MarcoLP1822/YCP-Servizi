/**
 * @fileoverview
 * Questo modulo fornisce una funzione wrapper, `withErrorHandling`, per centralizzare
 * la gestione degli errori nelle API endpoints. La funzione intercetta errori imprevisti,
 * li logga e invia una risposta standardizzata con un messaggio di errore.
 *
 * Key features:
 * - Centralizza la gestione degli errori in un'unica funzione wrapper.
 * - Restituisce una risposta JSON consistente per errori interni.
 *
 * @dependencies
 * - Next.js types per NextApiRequest, NextApiResponse, e NextApiHandler.
 *
 * @notes
 * - Tutti gli endpoint API possono essere refattorizzati per utilizzare questo wrapper.
 */

import type { NextApiRequest, NextApiResponse, NextApiHandler } from 'next';

export function withErrorHandling(handler: NextApiHandler): NextApiHandler {
  return async (req: NextApiRequest, res: NextApiResponse) => {
    try {
      await handler(req, res);
    } catch (error: any) {
      console.error("Centralized Error:", error);
      // Se l'errore include un codice di stato, usalo; altrimenti, 500 per errore interno.
      const statusCode = error.statusCode || 500;
      const errorMessage = error.message || 'Errore interno del server.';
      res.status(statusCode).json({ error: errorMessage });
    }
  };
}
