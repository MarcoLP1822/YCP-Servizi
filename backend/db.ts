/**
 * @description
 * Questo file stabilisce la connessione al database PostgreSQL utilizzando Drizzle ORM.
 * Viene creato un pool di connessioni utilizzando il driver pg e viene esportata
 * l'istanza `db` per l'intero progetto.
 *
 * @dependencies
 * - pg: Driver per PostgreSQL.
 * - drizzle-orm: Per interazioni di database type-safe.
 *
 * @notes
 * - Assicurati che la variabile d'ambiente SUPABASE_URL sia impostata con la stringa di connessione corretta.
 * - Questo modulo è destinato all'uso lato server.
 */

import { Pool } from 'pg';
import { drizzle } from 'drizzle-orm/node-postgres';

// Crea un pool di connessioni utilizzando la stringa di connessione dal file .env
const pool = new Pool({
  connectionString: process.env.SUPABASE_URL,
  // In ambienti di produzione, potrebbe essere necessario abilitare SSL:
  // ssl: { rejectUnauthorized: false },
});

// Inizializza Drizzle ORM con il pool creato
export const db = drizzle(pool);
