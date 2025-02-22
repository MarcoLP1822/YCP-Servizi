/**
 * @fileoverview
 * Questo endpoint API gestisce il login degli utenti. Riceve una richiesta POST con
 * email e password, verifica le credenziali e ritorna un token JWT. L'endpoint è
 * stato refattorizzato per utilizzare il wrapper centralizzato per la gestione degli errori.
 *
 * Key features:
 * - Validazione degli input.
 * - Verifica delle credenziali con la funzione comparePassword.
 * - Generazione di un token JWT per l'utente autenticato.
 *
 * @dependencies
 * - backend/services/authService.ts per la gestione delle password e la generazione del token.
 * - backend/models/User.ts per il modello utente.
 * - backend/db.ts per l'accesso al database.
 * - backend/utils/errorHandler.ts per la gestione centralizzata degli errori.
 *
 * @notes
 * - L'endpoint supporta solo il metodo POST.
 */

import type { NextApiRequest, NextApiResponse } from 'next';
import { comparePassword, generateToken } from '../../../backend/services/authService';
import { Users } from '../../../backend/models/User';
import { db } from '../../../backend/db';
import { eq } from 'drizzle-orm';
import { withErrorHandling } from '../../../backend/utils/errorHandler';

interface LoginRequestBody {
  email: string;
  password: string;
}

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Metodo non consentito. Utilizzare POST.' });
  }

  const { email, password } = req.body as LoginRequestBody;
  if (!email || !password) {
    return res.status(400).json({ error: 'Campi "email" e "password" sono obbligatori.' });
  }

  // Recupera l'utente dal database usando l'email
  const users = await db.select().from(Users).where(eq(Users.email, email));
  if (users.length === 0) {
    return res.status(401).json({ error: 'Credenziali non valide.' });
  }
  const user = users[0];

  // Confronta la password fornita con quella memorizzata
  const isPasswordValid = await comparePassword(password, user.hashed_password);
  if (!isPasswordValid) {
    return res.status(401).json({ error: 'Credenziali non valide.' });
  }

  // Genera un token JWT per l'utente autenticato
  const token = generateToken({ user_id: user.user_id, username: user.username, email: user.email });
  return res.status(200).json({
    message: 'Accesso effettuato con successo.',
    token,
    user: {
      user_id: user.user_id,
      username: user.username,
      email: user.email,
    },
  });
};

export default withErrorHandling(handler);
