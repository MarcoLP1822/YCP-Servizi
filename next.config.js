/**
 * @fileoverview Next.js configuration for the YCP Servizi project.
 * This configuration file exposes essential environment variables to the Next.js application.
 * 
 * Key features:
 * - Enables React strict mode for highlighting potential issues.
 * - Provides environment variables for Supabase, OpenAI, and JWT authentication.
 * 
 * @notes
 * - Ensure that the .env.local file is populated with actual values before running the application.
 */

const nextConfig = {
    reactStrictMode: true,
    env: {
      DATABASE_URL: process.env.DATABASE_URL,
      SUPABASE_SERVICE_ROLE_KEY: process.env.SUPABASE_SERVICE_ROLE_KEY,
      OPENAI_API_KEY: process.env.OPENAI_API_KEY,
      JWT_SECRET: process.env.JWT_SECRET,
    },
  };
  
  module.exports = nextConfig;
  