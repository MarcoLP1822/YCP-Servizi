/**
 * @fileoverview
 * This component displays a standardized error message.
 * It is used across the application to provide a consistent look for error messages.
 *
 * Key features:
 * - Displays an error message with standardized styling.
 * - Easily reusable across various components.
 *
 * @dependencies
 * - React for component rendering.
 * - CSS Modules for styling.
 *
 * @notes
 * - The component expects a "message" prop which is the error message to display.
 * - If no message is provided, it renders nothing.
 */

import React from 'react';
import styles from './ErrorMessage.module.css';

interface ErrorMessageProps {
  message: string;
}

const ErrorMessage: React.FC<ErrorMessageProps> = ({ message }) => {
  if (!message) {
    return null;
  }
  return <div className={styles.errorMessage}>{message}</div>;
};

export default ErrorMessage;
