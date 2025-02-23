/**
 * @fileoverview
 * This API endpoint handles user registration. It receives a POST request with username, email, and password,
 * creates a new user, and returns a JWT token along with the user information.
 *
 * @dependencies
 * - backend/services/authService.ts for password hashing and token generation.
 * - backend/models/User.ts for the user model.
 * - backend/db.ts for database access.
 * - types/api.d.ts for API response types.
 */

import type { NextApiRequest, NextApiResponse } from 'next';
import { hashPassword, generateToken } from '../../../backend/services/authService';
import { Users } from '../../../backend/models/User';
import { db } from '../../../backend/db';
import { eq } from 'drizzle-orm';
import type { ApiResponse, RegisterResponse } from '../../../types/api';

interface RegisterRequestBody {
  username: string;
  email: string;
  password: string;
}

export default async function handler(req: NextApiRequest, res: NextApiResponse<ApiResponse<RegisterResponse>>) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: '', error: 'Metodo non consentito. Utilizzare POST.' });
  }

  try {
    const { username, email, password } = req.body as RegisterRequestBody;

    if (!username || !email || !password) {
      return res.status(400).json({ message: '', error: 'Campi "username", "email" e "password" sono obbligatori.' });
    }

    // Check if a user with the same email exists
    const existingUsersByEmail = await db.select().from(Users).where(eq(Users.email, email));
    if (existingUsersByEmail.length > 0) {
      return res.status(409).json({ message: '', error: 'Email già registrata.' });
    }

    // Check if username is already in use
    const existingUsersByUsername = await db.select().from(Users).where(eq(Users.username, username));
    if (existingUsersByUsername.length > 0) {
      return res.status(409).json({ message: '', error: 'Username già in uso.' });
    }

    // Hash the password and insert new user into the database
    const hashedPassword = await hashPassword(password);
    const newUsers = await db.insert(Users).values({
      username,
      email,
      hashed_password: hashedPassword,
    }).returning();

    const token = generateToken({ user_id: newUsers[0].user_id, username, email });

    return res.status(201).json({
      message: 'Registrazione avvenuta con successo.',
      data: {
        user_id: newUsers[0].user_id,
        username,
        email,
        token,
      },
    });
  } catch (error: unknown) {
    console.error('Errore durante la registrazione:', error);
    return res.status(500).json({ message: '', error: 'Errore interno del server durante la registrazione.' });
  }
}
