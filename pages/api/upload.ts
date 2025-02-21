/**
 * @description
 * Questo endpoint API gestisce il caricamento dei file. Valida il tipo di file (solo DOCX e PDF)
 * e la dimensione (max 30MB), quindi processa il file usando le librerie di parsing (Mammoth per DOCX e pdf-parse per PDF).
 * I metadati del file vengono salvati nel database (tramite un'istanza `db` configurata con Drizzle ORM) e il testo estratto viene restituito nella risposta.
 *
 * @dependencies
 * - formidable: Per il parsing dei dati multipart.
 * - fs & path: Per operazioni sul file system.
 * - backend/services/fileParser.ts: Contiene le funzioni per il parsing di file DOCX e PDF.
 * - backend/db.ts: Modulo per la connessione al database.
 *
 * @notes
 * - Assicurarsi di avere installato le dipendenze necessarie (formidable, mammoth, pdf-parse, @types/formidable se disponibili).
 * - Verifica che il percorso della cartella "backend" sia incluso nel tsconfig.json.
 */

import type { NextApiRequest, NextApiResponse } from 'next';
import formidable, { File as FormidableFile, Fields, Files } from 'formidable';
import fs from 'fs';
import path from 'path';
import { parseDocx, parsePdf } from '../../backend/services/fileParser';
import { Files as FilesTable } from '../../backend/models/File';
// Assumiamo che il modulo db sia configurato correttamente
import { db } from '../../backend/db';

export const config = {
  api: {
    bodyParser: false, // Disabilitiamo il body parser di Next.js per i caricamenti di file
  },
};

const MAX_FILE_SIZE = 30 * 1024 * 1024; // 30MB in bytes

/**
 * Funzione promissificata per il parsing dei dati di form utilizzando formidable.
 * @param req NextApiRequest
 * @returns Una Promise che risolve con i campi e i file inviati nel form.
 */
const parseForm = (req: NextApiRequest): Promise<{ fields: Fields; files: Files }> => {
  return new Promise((resolve, reject) => {
    const form = new formidable.IncomingForm({
      maxFileSize: MAX_FILE_SIZE,
      multiples: false,
      keepExtensions: true,
    });
    form.parse(req, (err: any, fields: Fields, files: Files) => {
      if (err) return reject(err);
      resolve({ fields, files });
    });
  });
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Metodo non consentito. Utilizzare POST.' });
  }

  try {
    // Parsing dei dati del form
    const { files } = await parseForm(req);
    const uploadedFile = files.file as FormidableFile;

    if (!uploadedFile) {
      return res.status(400).json({ error: 'Nessun file caricato.' });
    }

    // Validazione della dimensione del file
    if (uploadedFile.size > MAX_FILE_SIZE) {
      return res.status(400).json({ error: 'Il file supera il limite di 30MB.' });
    }

    // Validazione del tipo di file (DOCX o PDF)
    const allowedMimeTypes = [
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document', // DOCX
      'application/pdf', // PDF
    ];
    if (!allowedMimeTypes.includes(uploadedFile.mimetype || '')) {
      return res.status(400).json({ error: 'Tipo di file non supportato. Carica solo DOCX o PDF.' });
    }

    // Determina l'estensione del file per il processing
    const ext = path.extname(uploadedFile.originalFilename || '').toLowerCase();

    // Lettura del file dalla posizione temporanea
    const fileBuffer = fs.readFileSync(uploadedFile.filepath);

    let extractedText = '';

    // Elaborazione del file in base all'estensione
    if (ext === '.docx') {
      extractedText = await parseDocx(fileBuffer);
    } else if (ext === '.pdf') {
      extractedText = await parsePdf(fileBuffer);
    } else {
      return res.status(400).json({ error: 'Estensione file non supportata.' });
    }

    // Salvataggio dei metadati del file nel database (utilizzando Drizzle ORM)
    // Nota: Sostituisci 'some-user-uuid' con l'ID reale dell'utente autenticato
    const newFile = await db.insert(FilesTable).values({
      user_id: 'some-user-uuid', // Placeholder: sostituire con l'ID reale dell'utente
      file_name: uploadedFile.originalFilename || 'Unknown',
      file_type: uploadedFile.mimetype || 'Unknown',
      file_size: uploadedFile.size,
      storage_path: uploadedFile.filepath, // In produzione, sposta il file in una posizione di storage permanente.
      processing_status: 'complete',
    }).returning();

    // Restituzione della risposta con il testo estratto e i metadati del file
    return res.status(200).json({
      message: 'File caricato e processato con successo.',
      file: newFile,
      extractedText,
    });
  } catch (error: any) {
    console.error('Errore nel caricamento del file:', error);
    return res.status(500).json({ error: 'Errore interno del server.' });
  }
}
