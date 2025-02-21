/**
 * @fileoverview
 * This file is the custom App component for the Next.js application.
 * It wraps all pages with the AppProvider, integrating the global state management 
 * (user session, file upload status, AI output) throughout the application.
 *
 * Key features:
 * - Provides a global state via AppContext to all components.
 * - Ensures that state management is initialized at the root level.
 *
 * @dependencies
 * - React: For component rendering.
 * - Next.js: For the custom App component structure.
 * - AppProvider from the context/AppContext for state management.
 *
 * @notes
 * - This file also imports global styles (if available) to be applied across the app.
 */

import React from 'react';
import type { AppProps } from 'next/app';
import { AppProvider } from '../context/AppContext';
import '../styles/global.css'; // Ensure this file exists or update with your global styles

/**
 * MyApp is the custom App component that wraps all page components with the AppProvider.
 *
 * @param {AppProps} param0 - Contains the component and its props.
 * @returns The wrapped component with global state.
 */
const MyApp = ({ Component, pageProps }: AppProps) => {
  return (
    <AppProvider>
      <Component {...pageProps} />
    </AppProvider>
  );
};

export default MyApp;
