/**
 * @fileoverview
 * This middleware function validates JWT tokens from the Authorization header
 * and attaches authenticated user information to the request object.
 * 
 * Key features:
 * - Verifies the JWT token using the verifyToken function from authService.
 * - Attaches the decoded user information (user_id, username, email) to the request.
 * - Returns a 401 Unauthorized error if no token is provided or if the token is invalid.
 * 
 * @dependencies
 * - Next.js types for API requests and responses.
 * - backend/services/authService for token verification.
 * 
 * @notes
 * - This middleware should wrap any API endpoint that requires authentication.
 */

import { NextApiRequest, NextApiResponse, NextApiHandler } from 'next';
import { verifyToken } from '../services/authService';

// Define a custom interface that extends NextApiRequest to include user information
export interface AuthenticatedNextApiRequest extends NextApiRequest {
  user: {
    user_id: string;
    username: string;
    email: string;
  };
}

/**
 * Higher-order function that wraps an API handler with authentication.
 * It validates the JWT token from the Authorization header and attaches the user to the request.
 * 
 * @param handler - The original API handler to wrap.
 * @returns A new API handler that requires authentication.
 */
export function withAuth(handler: NextApiHandler) {
  return async (req: NextApiRequest, res: NextApiResponse) => {
    try {
      const authHeader = req.headers.authorization;
      if (!authHeader) {
        return res.status(401).json({ error: 'Autorizzazione mancante. Effettua il login.' });
      }
      
      // Expect the token to be in the format "Bearer <token>"
      const token = authHeader.split(' ')[1];
      if (!token) {
        return res.status(401).json({ error: 'Token non fornito.' });
      }

      // Verify the token and attach the decoded user to the request
      const decoded = verifyToken(token);
      // Type assertion: assuming decoded has the required fields
      (req as AuthenticatedNextApiRequest).user = {
        user_id: decoded.user_id,
        username: decoded.username,
        email: decoded.email,
      };

      return handler(req, res);
    } catch (error) {
      console.error('Errore di autenticazione:', error);
      return res.status(401).json({ error: 'Token non valido o scaduto.' });
    }
  };
}
