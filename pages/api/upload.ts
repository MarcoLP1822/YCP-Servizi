/**
 * @fileoverview
 * Questo endpoint API gestisce il caricamento dei file.
 * Valida il tipo di file (DOCX o PDF) e la dimensione, estrae il testo usando le librerie Mammoth o pdf-parse,
 * esegue l'analisi tecnica e registra i metadati nel database.
 *
 * @dependencies
 * - formidable per il parsing dei form multipart.
 * - fs e path per operazioni sul file system.
 * - backend/services/fileParser.ts per il parsing dei file.
 * - backend/services/fileAnalysis.ts per l'analisi tecnica.
 * - backend/db.ts e backend/models/File.ts per l'accesso al database.
 *
 * @notes
 * - Gli errori sono gestiti con "unknown" per conformarsi alle regole ESLint.
 */

import type { NextApiRequest, NextApiResponse } from 'next';
import formidable, { File as FormidableFile, Fields, Files } from 'formidable';
import fs from 'fs';
import path from 'path';
import { parseDocx, parsePdf } from '../../backend/services/fileParser';
import { analyzeDocument } from '../../backend/services/fileAnalysis';
import { Files as FilesTable } from '../../backend/models/File';
import { db } from '../../backend/db';

export const config = {
  api: {
    bodyParser: false, // Disabilitiamo il body parser di Next.js per i caricamenti di file
  },
};

const MAX_FILE_SIZE = 30 * 1024 * 1024; // 30MB

/**
 * Funzione per il parsing del form usando formidable.
 * @param req NextApiRequest
 * @returns Una Promise che risolve con i campi e i file del form.
 */
const parseForm = (req: NextApiRequest): Promise<{ fields: Fields; files: Files }> => {
  return new Promise((resolve, reject) => {
    const form = new formidable.IncomingForm({
      maxFileSize: MAX_FILE_SIZE,
      multiples: false,
      keepExtensions: true,
    });
    form.parse(req, (err, fields, files) => {
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
    // Gestione del caso in cui files.file possa essere un array
    const uploaded = files.file;
    let uploadedFile: FormidableFile | undefined;
    if (Array.isArray(uploaded)) {
      uploadedFile = uploaded[0];
    } else {
      uploadedFile = uploaded;
    }

    if (!uploadedFile) {
      return res.status(400).json({ error: 'Nessun file caricato.' });
    }

    // Validazione della dimensione del file
    if (uploadedFile.size > MAX_FILE_SIZE) {
      return res.status(400).json({ error: 'Il file supera il limite di 30MB.' });
    }

    // Validazione del tipo di file (DOCX o PDF)
    const allowedMimeTypes = [
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'application/pdf',
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

    // Esegue l'analisi tecnica sul testo estratto
    const technicalAnalysis = analyzeDocument(extractedText);

    // Salvataggio dei metadati del file nel database
    // Nota: sostituisci 'some-user-uuid' con l'ID reale dell'utente autenticato.
    const newFile = await db.insert(FilesTable).values({
      user_id: 'some-user-uuid',
      file_name: uploadedFile.originalFilename || 'Unknown',
      file_type: uploadedFile.mimetype || 'Unknown',
      file_size: uploadedFile.size,
      storage_path: uploadedFile.filepath,
      processing_status: 'complete',
    }).returning();

    // Restituzione della risposta con il testo estratto, l'analisi tecnica e i metadati del file
    return res.status(200).json({
      message: 'File caricato e processato con successo.',
      file: newFile,
      extractedText,
      technicalAnalysis,
    });
  } catch (error: unknown) {
    console.error('Errore nel caricamento del file:', error);
    return res.status(500).json({ error: 'Errore interno del server.' });
  }
}
