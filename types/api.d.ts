/**
 * @fileoverview
 * This file defines common API response types and interfaces used throughout the YCP Servizi project.
 * It provides strong type definitions for API responses, user objects, and error messages.
 *
 * Key interfaces:
 * - ApiResponse<T>: A generic interface for a successful response.
 * - ErrorResponse: Interface for error responses.
 * - UserResponse, LoginResponse, RegisterResponse, GenerateResponse: Specific interfaces for various endpoints.
 *
 * @notes
 * - These interfaces help ensure type safety across API endpoints.
 */

export interface ApiResponse<T> {
    message: string;
    data?: T;
    error?: string;
  }
  
  export interface ErrorResponse {
    error: string;
  }
  
  export interface UserResponse {
    user_id: string;
    username: string;
    email: string;
  }
  
  export interface LoginResponse extends UserResponse {
    token: string;
  }
  
  export interface RegisterResponse extends UserResponse {
    token: string;
  }
  
  export interface GenerateResponse {
    output: string;
  }
  
  export interface LogEntry {
    log_id: string;
    timestamp: string;
    action_type: string;
    description: string;
  }
  
  export interface LogResponse {
    log: LogEntry;
  }
  
  export interface SessionResponse {
    session?: any;
    sessions?: any;
  }
  