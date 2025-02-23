/**
 * @fileoverview
 * This file provides utility functions for handling authentication tasks,
 * including password hashing, password comparison, JWT token generation, and verification.
 *
 * Key features:
 * - Secure password hashing and comparison using bcrypt.
 * - JWT token generation and verification using jsonwebtoken.
 *
 * @dependencies
 * - bcrypt: Used for hashing and comparing passwords.
 * - jsonwebtoken: Used for generating and verifying JWT tokens.
 *
 * @notes
 * - Ensure that the environment variable JWT_SECRET is set in your .env file.
 * - In production, use a strong secret and implement robust error handling.
 */

import bcrypt from 'bcrypt';
import jwt, { SignOptions } from 'jsonwebtoken';

// Constant for bcrypt salt rounds used during hashing
const SALT_ROUNDS = 10;

// Retrieve JWT secret from environment variables; use a fallback for development only.
const JWT_SECRET: string = process.env.JWT_SECRET || 'default_jwt_secret';

/**
 * Hashes a plain text password using bcrypt.
 *
 * @param {string} password - The plain text password to be hashed.
 * @returns {Promise<string>} A promise that resolves to the hashed password.
 */
export async function hashPassword(password: string): Promise<string> {
  // Hash the password using the defined number of salt rounds.
  return bcrypt.hash(password, SALT_ROUNDS);
}

/**
 * Compares a plain text password with a hashed password.
 *
 * @param {string} password - The plain text password to compare.
 * @param {string} hashedPassword - The hashed password for comparison.
 * @returns {Promise<boolean>} A promise that resolves to true if the passwords match, otherwise false.
 */
export async function comparePassword(password: string, hashedPassword: string): Promise<boolean> {
  // Compare the provided password with the stored hashed password.
  return bcrypt.compare(password, hashedPassword);
}

/**
 * Generates a JWT token for a given payload.
 *
 * @param {object} payload - The payload to encode in the JWT token.
 * @param {string} [expiresIn='1h'] - Optional expiration time for the token.
 * @returns {string} A signed JWT token string.
 */
export function generateToken(payload: object, expiresIn: string = '1h'): string {
  // Create signing options with the specified expiration time.
  const options: SignOptions = { expiresIn: expiresIn as any };
  // Sign the token using the JWT_SECRET and return the token string.
  return jwt.sign(payload, JWT_SECRET, options);
}

/**
 * Verifies a JWT token and returns its decoded payload.
 *
 * @param {string} token - The JWT token to verify.
 * @returns {any} The decoded token payload if verification is successful.
 * @throws Will throw an error if the token is invalid or expired.
 */
export function verifyToken(token: string): any {
  // Verify and decode the token using the JWT_SECRET.
  return jwt.verify(token, JWT_SECRET);
}
