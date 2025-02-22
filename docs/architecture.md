# Architettura del Sistema

## Panoramica

Il sistema **YCP Servizi** è un'applicazione web sviluppata in Next.js con TypeScript. L'obiettivo principale è fornire una piattaforma in italiano per autori, editori e professionisti del settore letterario per caricare file di libri (in formato DOCX o PDF) e ottenere contenuti generati dall'AI (come blurb, descrizioni, parole chiave, categorie, prologhi ed analisi approfondite).

## Struttura del Progetto

### Frontend
- **Framework:** Next.js con React e TypeScript.
- **Directory principali:**
  - `/pages`: Contiene le pagine per il routing (dashboard, upload, editor).
  - `/components`: Componenti UI riutilizzabili (FileUploader, ContentEditor, LogViewer, Navigation, Layout).
  - `/styles`: File CSS globali e specifici dei componenti, seguendo i principi del Material Design.
  - `/context` o `/store`: Gestione dello stato globale tramite React Context o Redux.
  
### Backend
- **API Routes:** Implementate in Next.js, gestiscono il caricamento dei file, l'integrazione con l'API OpenAI, l'autenticazione, il logging e la gestione delle sessioni.
- **Directory principali:**
  - `/backend/services`: Funzioni per il parsing dei file (Mammoth per DOCX, pdf-parse per PDF), integrazione con OpenAI, analisi tecnica dei documenti e logging.
  - `/backend/models`: Modelli definiti con Drizzle ORM per interagire con il database (PostgreSQL tramite Supabase).
  - `/backend/db.ts`: Configurazione della connessione al database.
  
### Database
- **Database:** Supabase (PostgreSQL)
- **ORM:** Drizzle ORM per interazioni sicure e type-safe con il database.
- **Tabelle principali:**
  - `Users`, `Files`, `AIOutputs`, `SessionHistory`, `Logs`, `Catalog`
  
### Integrazioni Esterne
- **OpenAI API:** Utilizzata per generare contenuti basati sul testo estratto dai file.
- **Supabase:** Gestisce il database e le operazioni CRUD tramite Drizzle ORM.

## Flusso dei Dati

1. **Caricamento File:** L'utente carica un file tramite il componente FileUploader. Il backend gestisce la validazione (tipo e dimensione) e il parsing del file.
2. **Parsing e Analisi:** Il file viene analizzato (usando Mammoth o pdf-parse) e vengono estratti testo e metadati tecnici.
3. **Generazione Contenuti AI:** Il testo estratto viene inviato a un endpoint API che interagisce con l'API OpenAI per generare vari tipi di contenuti.
4. **Editing e Sessione:** I contenuti generati sono mostrati in un editor (ContentEditor) che consente modifiche e rigenerazione. Le azioni degli utenti sono registrate in Logs e SessionHistory.
5. **Gestione Stato e Sicurezza:** Il sistema utilizza JWT per l'autenticazione e React Context per la gestione dello stato a livello di applicazione.

## Considerazioni di Scalabilità e Sicurezza

- **Scalabilità:** Il design modulare e l'uso di Supabase con Drizzle ORM permettono di scalare l'applicazione gestendo efficientemente numerose richieste contemporanee.
- **Sicurezza:** L'implementazione di un sistema di autenticazione basato su JWT e l'utilizzo di HTTPS garantiscono una gestione sicura dei dati utente e delle operazioni.

## Note Finali

Questa documentazione fornisce una panoramica completa dell'architettura del sistema, utile per comprendere la struttura e facilitare la manutenzione e l'espansione future del progetto.
