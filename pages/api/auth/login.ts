/**
 * @fileoverview
 * This API endpoint handles user login by verifying credentials and issuing a JWT token.
 *
 * Key features:
 * - Validates that the request method is POST.
 * - Checks required fields (email and password) are provided.
 * - Retrieves the user from the database by email.
 * - Compares the provided password with the stored hashed password.
 * - Generates and returns a JWT token if credentials are valid.
 *
 * @dependencies
 * - backend/services/authService.ts: Provides functions for password comparison and token generation.
 * - backend/models/User.ts: The User model for database operations.
 * - backend/db.ts: Database connection instance.
 * - backend/utils/errorHandler.ts: Centralized error handling wrapper.
 * - types/api.d.ts: Type definitions for API responses.
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

/**
 * Handler function for processing login requests.
 *
 * @param {NextApiRequest} req - The incoming HTTP request.
 * @param {NextApiResponse<ApiResponse<LoginResponse>>} res - The HTTP response object.
 * @returns {Promise<void>} A promise that resolves when the request is processed.
 */
const handler = async (req: NextApiRequest, res: NextApiResponse<ApiResponse<LoginResponse>>): Promise<void> => {
  // Only allow POST requests for login.
  if (req.method !== 'POST') {
    res.status(405).json({ message: '', error: 'Metodo non consentito. Utilizzare POST.' });
    return;
  }

  // Extract email and password from the request body.
  const { email, password } = req.body as LoginRequestBody;
  if (!email || !password) {
    res.status(400).json({ message: '', error: 'Campi "email" e "password" sono obbligatori.' });
    return;
  }

  // Retrieve the user from the database using the provided email.
  const users = await db.select().from(Users).where(eq(Users.email, email));
  if (users.length === 0) {
    res.status(401).json({ message: '', error: 'Credenziali non valide.' });
    return;
  }
  const user = users[0];

  // Compare the provided password with the stored hashed password.
  const isPasswordValid = await comparePassword(password, user.hashed_password);
  if (!isPasswordValid) {
    res.status(401).json({ message: '', error: 'Credenziali non valide.' });
    return;
  }

  // Generate a JWT token for the authenticated user.
  const token = generateToken({ user_id: user.user_id, username: user.username, email: user.email });
  
  // Return a successful response with user details and the token.
  res.status(200).json({
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
