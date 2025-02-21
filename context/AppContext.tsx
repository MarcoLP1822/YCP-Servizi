/**
 * @fileoverview
 * This file provides the global state management for the YCP Servizi application using React Context.
 * It defines the AppContext which holds the global state including:
 * - User session data (user details and JWT token)
 * - File upload status (uploading flag, error messages, and file object)
 * - AI output (generated content string)
 *
 * The AppProvider wraps the application and provides state update functions to its children.
 *
 * Key features:
 * - Centralized state for user, file upload status, and AI output.
 * - Strong type definitions using TypeScript interfaces.
 * - Easy integration into the app via the AppProvider.
 *
 * @dependencies
 * - React: For creating the context and managing state.
 *
 * @notes
 * - This implementation uses useState for state management.
 * - The context is initialized with undefined and a custom provider is used to supply values.
 */

import React, { createContext, useState, ReactNode } from 'react';

// Define an interface for user session data.
export interface User {
  user_id: string;
  username: string;
  email: string;
  token: string;
}

// Define an interface for file upload status.
export interface FileUploadStatus {
  uploading: boolean;
  error: string | null;
  file?: File;
}

// Define the shape of the global context state.
export interface AppContextType {
  user: User | null;
  setUser: (user: User | null) => void;
  fileUploadStatus: FileUploadStatus;
  setFileUploadStatus: (status: FileUploadStatus) => void;
  aiOutput: string;
  setAiOutput: (output: string) => void;
}

// Create the context with an undefined initial value.
export const AppContext = createContext<AppContextType | undefined>(undefined);

// Define props for the provider component.
interface AppProviderProps {
  children: ReactNode;
}

/**
 * AppProvider component that wraps the application and provides global state.
 *
 * @param {AppProviderProps} props - Contains the children components that require access to the global state.
 * @returns The AppContext.Provider wrapping children with state and updater functions.
 */
export const AppProvider: React.FC<AppProviderProps> = ({ children }) => {
  // User state management.
  const [user, setUser] = useState<User | null>(null);

  // File upload status state management.
  const [fileUploadStatus, setFileUploadStatus] = useState<FileUploadStatus>({
    uploading: false,
    error: null,
    file: undefined,
  });

  // AI output state management.
  const [aiOutput, setAiOutput] = useState<string>('');

  return (
    <AppContext.Provider
      value={{
        user,
        setUser,
        fileUploadStatus,
        setFileUploadStatus,
        aiOutput,
        setAiOutput,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};
