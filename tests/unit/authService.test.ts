/**
 * @fileoverview
 * This file contains unit tests for the authentication service in
 * backend/services/authService.ts. It verifies that password hashing,
 * password comparison, and JWT token generation and verification function correctly.
 *
 * Key features:
 * - Tests that a password is hashed and can be validated.
 * - Tests JWT token generation and verification.
 * - Ensures that invalid tokens throw an error.
 *
 * @dependencies
 * - jest: For testing.
 * - bcrypt: Used in the auth service.
 * - jsonwebtoken: Used in the auth service.
 *
 * @notes
 * - The tests assume that the environment variable JWT_SECRET is set (or defaults to 'default_jwt_secret').
 */

import { hashPassword, comparePassword, generateToken, verifyToken } from '../../backend/services/authService';
import jwt from 'jsonwebtoken';

describe('Auth Service', () => {
  const testPassword = 'mysecretpassword';
  let hashed: string;

  it('should hash password correctly', async () => {
    hashed = await hashPassword(testPassword);
    expect(hashed).not.toBe(testPassword);
    expect(hashed).toBeDefined();
  });

  it('should compare correct password', async () => {
    const isValid = await comparePassword(testPassword, hashed);
    expect(isValid).toBe(true);
  });

  it('should fail to compare incorrect password', async () => {
    const isValid = await comparePassword('wrongpassword', hashed);
    expect(isValid).toBe(false);
  });

  it('should generate a valid token', () => {
    const payload = { user_id: '123', username: 'testuser', email: 'test@example.com' };
    const token = generateToken(payload, '1h');
    expect(token).toBeDefined();
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'default_jwt_secret');
    expect(decoded).toMatchObject(payload);
  });

  it('should verify a valid token', () => {
    const payload = { user_id: '456', username: 'anotheruser', email: 'another@example.com' };
    const token = generateToken(payload, '1h');
    const decoded = verifyToken(token);
    expect(decoded).toMatchObject(payload);
  });

  it('should throw an error for invalid token', () => {
    expect(() => verifyToken('invalid.token.here')).toThrow();
  });
});
