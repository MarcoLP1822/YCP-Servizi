/**
 * @fileoverview
 * This file provides utility functions for handling authentication tasks,
 * including password hashing, password comparison, JWT token generation, and verification.
 *
 * Key features:
 * - Uses bcrypt for secure password hashing and verification.
 * - Uses jsonwebtoken for JWT token generation and verification.
 *
 * @dependencies
 * - bcrypt: For hashing and comparing passwords.
 * - jsonwebtoken: For generating and verifying JWT tokens.
 *
 * @notes
 * - Ensure that the environment variable JWT_SECRET is set in your .env file.
 * - In production, make sure to use a strong secret and proper error handling.
 */

import bcrypt from 'bcrypt';
import jwt, { SignOptions } from 'jsonwebtoken';

// Set bcrypt salt rounds
const SALT_ROUNDS = 10;

// Get JWT secret from environment variables; fallback is provided for development purposes only.
const JWT_SECRET: string = process.env.JWT_SECRET || 'default_jwt_secret';

/**
 * Hashes a plain text password using bcrypt.
 *
 * @param password - The plain text password.
 * @returns A promise that resolves to the hashed password.
 */
export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, SALT_ROUNDS);
}

/**
 * Compares a plain text password with a hashed password.
 *
 * @param password - The plain text password.
 * @param hashedPassword - The hashed password.
 * @returns A promise that resolves to true if the password matches, false otherwise.
 */
export async function comparePassword(password: string, hashedPassword: string): Promise<boolean> {
  return bcrypt.compare(password, hashedPassword);
}

/**
 * Generates a JWT token for a given user payload.
 *
 * @param payload - The payload to embed in the token.
 * @param expiresIn - Token expiry time (default is '1h').
 * @returns A signed JWT token.
 */
export function generateToken(payload: object, expiresIn: string = '1h'): string {
  // Cast expiresIn to any to bypass type checking issues with the expiresIn field.
  const options: SignOptions = { expiresIn: expiresIn as any };
  return jwt.sign(payload, JWT_SECRET, options);
}

/**
 * Verifies a given JWT token.
 *
 * @param token - The JWT token to verify.
 * @returns The decoded payload if the token is valid.
 * @throws An error if the token is invalid or expired.
 */
export function verifyToken(token: string): any {
  return jwt.verify(token, JWT_SECRET);
}
