/**
 * @fileoverview
 * This API endpoint handles user login.
 * It accepts a POST request with email and password, verifies the credentials,
 * and returns a JWT token upon successful authentication.
 *
 * Dependencies:
 * - backend/services/authService.ts: For password comparison and JWT token generation.
 * - backend/models/User.ts: For user model definitions.
 * - backend/db.ts: For database connection using Drizzle ORM.
 *
 * @notes
 * - Ensure that the required authentication packages are installed (bcrypt, jsonwebtoken).
 * - Error handling includes validation for missing fields and invalid credentials.
 */

import type { NextApiRequest, NextApiResponse } from 'next';
import { comparePassword, generateToken } from '../../../backend/services/authService';
import { Users } from '../../../backend/models/User';
import { db } from '../../../backend/db';
import { eq } from 'drizzle-orm';

interface LoginRequestBody {
  email: string;
  password: string;
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Metodo non consentito. Utilizzare POST.' });
  }

  try {
    const { email, password } = req.body as LoginRequestBody;

    // Validate required fields
    if (!email || !password) {
      return res.status(400).json({ error: 'Campi "email" e "password" sono obbligatori.' });
    }

    // Retrieve user by email from the database
    const users = await db.select().from(Users).where(eq(Users.email, email));
    if (users.length === 0) {
      return res.status(401).json({ error: 'Credenziali non valide.' });
    }
    const user = users[0];

    // Compare the provided password with the stored hashed password
    const isPasswordValid = await comparePassword(password, user.hashed_password);
    if (!isPasswordValid) {
      return res.status(401).json({ error: 'Credenziali non valide.' });
    }

    // Generate a JWT token for the authenticated user
    const token = generateToken({ user_id: user.user_id, username: user.username, email: user.email });

    // Return success response with token and user details
    return res.status(200).json({
      message: 'Accesso effettuato con successo.',
      token,
      user: {
        user_id: user.user_id,
        username: user.username,
        email: user.email,
      },
    });
  } catch (error: any) {
    console.error('Errore durante il login:', error);
    return res.status(500).json({ error: 'Errore interno del server durante il login.' });
  }
}
