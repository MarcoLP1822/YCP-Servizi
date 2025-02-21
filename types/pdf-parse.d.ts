/**
 * @fileoverview
 * Questo file di dichiarazione fornisce definizioni di tipo minime per il modulo 'pdf-parse'.
 * Poiché non esistono definizioni ufficiali per questo modulo, qui si dichiara il modulo
 * per permettere il corretto funzionamento in un progetto TypeScript.
 *
 * @dependencies
 * - pdf-parse: Utilizzato per l'estrazione del testo da file PDF.
 *
 * @notes
 * - Le definizioni di tipo qui fornite sono minime e potrebbero essere estese in base alle necessità.
 * - Assicurarsi che la cartella 'types' sia inclusa nel tsconfig.json.
 */

declare module 'pdf-parse' {
    /**
     * Interfaccia per i dati estratti da un file PDF.
     */
    interface PDFData {
      text: string;
      info?: any;
      metadata?: any;
      version?: string;
    }
  
    /**
     * Interfaccia per le opzioni di parsing del PDF.
     */
    interface PDFParseOptions {
      /**
       * Funzione per il rendering della pagina.
       * @param pageData Dati relativi alla pagina da renderizzare.
       * @returns La stringa di testo renderizzata.
       */
      pagerender?: (pageData: any) => string;
      /**
       * Numero massimo di pagine da processare.
       */
      max?: number;
      /**
       * Versione del parser o altre opzioni specifiche.
       */
      version?: string;
    }
  
    /**
     * Funzione principale per l'estrazione del testo da un Buffer contenente un PDF.
     * @param buffer Buffer contenente i dati del file PDF.
     * @param options Opzionali, impostazioni per il parsing.
     * @returns Una Promise che risolve con i dati estratti dal PDF.
     */
    function pdf(buffer: Buffer, options?: PDFParseOptions): Promise<PDFData>;
  
    export = pdf;
  }
  