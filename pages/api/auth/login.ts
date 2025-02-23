/**
 * @fileoverview
 * This endpoint API handles user login. It receives a POST request with email and password,
 * verifies the credentials, and returns a JWT token along with user information.
 *
 * Key features:
 * - Input validation.
 * - Password comparison using comparePassword.
 * - JWT token generation.
 *
 * @dependencies
 * - backend/services/authService.ts for password handling and token generation.
 * - backend/models/User.ts for the user model.
 * - backend/db.ts for database access.
 * - backend/utils/errorHandler.ts for centralized error handling.
 * - types/api.d.ts for API response types.
 */

import type { NextApiRequest, NextApiResponse } from 'next';
import { comparePassword, generateToken } from '../../../backend/services/authService';
import { Users } from '../../../backend/models/User';
import { db } from '../../../backend/db';
import { eq } from 'drizzle-orm';
import { withErrorHandling } from '../../../backend/utils/errorHandler';
import type { ApiResponse, LoginResponse } from '../../../types/api';

interface LoginRequestBody {
  email: string;
  password: string;
}

const handler = async (req: NextApiRequest, res: NextApiResponse<ApiResponse<LoginResponse>>) => {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: '', error: 'Metodo non consentito. Utilizzare POST.' });
  }

  const { email, password } = req.body as LoginRequestBody;
  if (!email || !password) {
    return res.status(400).json({ message: '', error: 'Campi "email" e "password" sono obbligatori.' });
  }

  // Retrieve the user from the database using the email
  const users = await db.select().from(Users).where(eq(Users.email, email));
  if (users.length === 0) {
    return res.status(401).json({ message: '', error: 'Credenziali non valide.' });
  }
  const user = users[0];

  // Compare provided password with stored hashed password
  const isPasswordValid = await comparePassword(password, user.hashed_password);
  if (!isPasswordValid) {
    return res.status(401).json({ message: '', error: 'Credenziali non valide.' });
  }

  // Generate a JWT token for the authenticated user
  const token = generateToken({ user_id: user.user_id, username: user.username, email: user.email });
  return res.status(200).json({
    message: 'Accesso effettuato con successo.',
    data: {
      user_id: user.user_id,
      username: user.username,
      email: user.email,
      token,
    },
  });
};

export default withErrorHandling(handler);
