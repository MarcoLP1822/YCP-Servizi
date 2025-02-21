/**
 * @fileoverview
 * This API endpoint handles user registration.
 * It accepts a POST request with username, email, and password, hashes the password,
 * creates a new user record in the database, and returns a JWT token upon successful registration.
 *
 * Dependencies:
 * - backend/services/authService.ts: For password hashing and JWT token generation.
 * - backend/models/User.ts: For user model definitions.
 * - backend/db.ts: For database connection using Drizzle ORM.
 *
 * @notes
 * - Ensure that the required authentication packages are installed (bcrypt, jsonwebtoken).
 * - Error handling includes basic validation and duplicate checks.
 */

import type { NextApiRequest, NextApiResponse } from 'next';
import { hashPassword, generateToken } from '../../../backend/services/authService';
import { Users } from '../../../backend/models/User';
import { db } from '../../../backend/db';
import { eq } from 'drizzle-orm';

interface RegisterRequestBody {
  username: string;
  email: string;
  password: string;
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Metodo non consentito. Utilizzare POST.' });
  }

  try {
    const { username, email, password } = req.body as RegisterRequestBody;

    // Validate required fields
    if (!username || !email || !password) {
      return res.status(400).json({ error: 'Campi "username", "email" e "password" sono obbligatori.' });
    }

    // Check if user already exists by email
    const existingUsersByEmail = await db.select().from(Users).where(eq(Users.email, email));
    if (existingUsersByEmail.length > 0) {
      return res.status(409).json({ error: 'Email già registrata.' });
    }

    // Check if username is already in use
    const existingUsersByUsername = await db.select().from(Users).where(eq(Users.username, username));
    if (existingUsersByUsername.length > 0) {
      return res.status(409).json({ error: 'Username già in uso.' });
    }

    // Hash the provided password
    const hashedPassword = await hashPassword(password);

    // Insert new user into the database
    const newUsers = await db
      .insert(Users)
      .values({
        username,
        email,
        hashed_password: hashedPassword,
      })
      .returning();

    // Generate a JWT token for the newly registered user
    const token = generateToken({ user_id: newUsers[0].user_id, username, email });

    // Return success response with token and user details
    return res.status(201).json({
      message: 'Registrazione avvenuta con successo.',
      token,
      user: {
        user_id: newUsers[0].user_id,
        username,
        email,
      },
    });
  } catch (error: any) {
    console.error('Errore durante la registrazione:', error);
    return res.status(500).json({ error: 'Errore interno del server durante la registrazione.' });
  }
}
