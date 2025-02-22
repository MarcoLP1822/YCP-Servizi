/**
 * @fileoverview
 * Questo modulo contiene funzioni di utilità per la validazione e il processamento
 * dei file caricati. Le funzioni incluse sono:
 * - validateUploadedFile: Verifica che il file caricato rispetti il limite di dimensione
 *   e che il suo tipo MIME sia tra quelli consentiti (DOCX o PDF).
 * - getFileExtension: Estrae l'estensione del file in formato minuscolo.
 *
 * Key features:
 * - Centralizzazione della logica di validazione per i file.
 * - Miglioramento della manutenibilità e riusabilità del codice.
 *
 * @dependencies
 * - path: Per l'estrazione dell'estensione del file.
 *
 * @notes
 * - Il modulo assume che i file caricati siano di tipo FormidableFile.
 */

import path from 'path';
import { File as FormidableFile } from 'formidable';

// Definisce i tipi MIME consentiti per i file
export const allowedMimeTypes = [
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document', // DOCX
  'application/pdf', // PDF
];

/**
 * Interfaccia per il risultato della validazione del file.
 */
export interface FileValidationResult {
  valid: boolean;
  error?: string;
}

/**
 * Valida il file caricato verificando la dimensione massima e il tipo MIME.
 *
 * @param file Il file caricato (oggetto FormidableFile).
 * @param maxFileSize La dimensione massima consentita in byte.
 * @returns Un oggetto che indica se il file è valido e, in caso contrario, un messaggio di errore.
 */
export function validateUploadedFile(
  file: FormidableFile,
  maxFileSize: number
): FileValidationResult {
  if (file.size > maxFileSize) {
    return {
      valid: false,
      error: `Il file supera il limite di ${maxFileSize / (1024 * 1024)}MB.`,
    };
  }
  if (!allowedMimeTypes.includes(file.mimetype || '')) {
    return {
      valid: false,
      error: 'Tipo di file non supportato. Carica solo DOCX o PDF.',
    };
  }
  return { valid: true };
}

/**
 * Estrae l'estensione del file dal nome originale in formato minuscolo.
 *
 * @param file Il file caricato (oggetto FormidableFile).
 * @returns L'estensione del file, ad esempio ".pdf" o ".docx".
 */
export function getFileExtension(file: FormidableFile): string {
  const originalName = file.originalFilename || '';
  return path.extname(originalName).toLowerCase();
}
