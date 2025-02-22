# Guida alla Configurazione del Progetto

## Prerequisiti

Assicurati di avere installato:
- [Node.js](https://nodejs.org/) (versione 14 o successiva)
- [Git](https://git-scm.com/)
- Un editor di codice (es. Visual Studio Code)
- [Supabase](https://supabase.com/) per il database PostgreSQL

## Installazione del Progetto

1. **Clona il repository:**
   ```bash
   git clone https://github.com/your-username/your-repo.git
   cd your-repo
2. **Installa le dipendenze:**
   ```bash
   npm install
   ```
3. **Configura le variabili d'ambiente:**
   Crea un file .env.local nella radice del progetto copiando il contenuto di .env.example.
   Sostituisci i placeholder con i tuoi valori reali:
4. **Configurazione del Database:**
   Assicurati che il file drizzle.config.ts sia configurato correttamente. Questo file utilizza la variabile d'ambiente DATABASE_URL per connettersi al tuo database Supabase.
   Genera gli script di migrazione eseguendo il comando:
   ```bash
   npx drizzle-kit generate
   ```
   Questo comando genererà automaticamente gli script di migrazione basandosi sui modelli definiti nella cartella backend/models.

   Esegui le migrazioni:
   ```bash
   npx drizzle-kit migrate
   ```
5. **Avvia il server di sviluppo:**
   ```bash
   npm run dev
   ```

