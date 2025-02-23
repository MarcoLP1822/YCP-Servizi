/**
 * @fileoverview
 * This API endpoint handles file uploads. It validates the file type (DOCX or PDF),
 * extracts text using appropriate libraries, performs technical analysis,
 * and stores file metadata in the database.
 *
 * @dependencies
 * - formidable for multipart form parsing.
 * - fs for file system operations.
 * - backend/services/fileParser.ts for file parsing.
 * - backend/services/fileAnalysis.ts for technical analysis.
 * - backend/utils/fileUtils.ts for file validation.
 * - backend/db.ts and backend/models/File.ts for database operations.
 * - backend/middleware/authMiddleware.ts for authentication.
 * - backend/utils/errorHandler.ts for centralized error handling.
 * - types/api.d.ts for API response types.
 */

import type { NextApiRequest, NextApiResponse } from 'next';
import formidable, { File as FormidableFile, Fields, Files } from 'formidable';
import fs from 'fs';
import { parseDocx, parsePdf } from '../../backend/services/fileParser';
import { analyzeDocument } from '../../backend/services/fileAnalysis';
import { Files as FilesTable } from '../../backend/models/File';
import { db } from '../../backend/db';
import { withAuth, AuthenticatedNextApiRequest } from '../../backend/middleware/authMiddleware';
import { validateUploadedFile, getFileExtension } from '../../backend/utils/fileUtils';
import { withErrorHandling } from '../../backend/utils/errorHandler';
import type { ApiResponse } from '../../types/api';

export const config = {
  api: {
    bodyParser: false,
  },
};

const parseForm = (req: NextApiRequest): Promise<{ fields: Fields; files: Files }> => {
  return new Promise((resolve, reject) => {
    const form = new formidable.IncomingForm({
      maxFileSize: 30 * 1024 * 1024, // 30MB
      multiples: false,
      keepExtensions: true,
    });
    form.parse(req, (err, fields, files) => {
      if (err) return reject(err);
      resolve({ fields, files });
    });
  });
};

const handler = async (req: NextApiRequest, res: NextApiResponse<ApiResponse<any>>) => {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: '', error: 'Metodo non consentito. Utilizzare POST.' });
  }

  const { files } = await parseForm(req);
  const uploaded = files.file;
  let uploadedFile: FormidableFile | undefined;
  if (Array.isArray(uploaded)) {
    uploadedFile = uploaded[0];
  } else {
    uploadedFile = uploaded;
  }

  if (!uploadedFile) {
    return res.status(400).json({ message: '', error: 'Nessun file caricato.' });
  }

  const validationResult = validateUploadedFile(uploadedFile, 30 * 1024 * 1024);
  if (!validationResult.valid) {
    return res.status(400).json({ message: '', error: validationResult.error });
  }

  const ext = getFileExtension(uploadedFile);
  const fileBuffer = fs.readFileSync(uploadedFile.filepath);
  let extractedText = '';

  if (ext === '.docx') {
    extractedText = await parseDocx(fileBuffer);
  } else if (ext === '.pdf') {
    extractedText = await parsePdf(fileBuffer);
  } else {
    return res.status(400).json({ message: '', error: 'Estensione file non supportata.' });
  }

  const technicalAnalysis = analyzeDocument(extractedText);
  const authReq = req as AuthenticatedNextApiRequest;

  const newFile = await db
    .insert(FilesTable)
    .values({
      user_id: authReq.user.user_id,
      file_name: uploadedFile.originalFilename || 'Unknown',
      file_type: uploadedFile.mimetype || 'Unknown',
      file_size: uploadedFile.size,
      storage_path: uploadedFile.filepath,
      processing_status: 'complete',
    })
    .returning();

  return res.status(200).json({
    message: 'File caricato e processato con successo.',
    data: {
      file: newFile,
      extractedText,
      technicalAnalysis,
    },
  });
};

export default withAuth(withErrorHandling(handler));
