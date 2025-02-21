/**
 * @description
 * This module provides utility functions to parse DOCX and PDF files.
 * - For DOCX files, it uses the Mammoth library to extract text.
 * - For PDF files, it uses the pdf-parse library to extract text.
 *
 * @dependencies
 * - mammoth: For processing DOCX files.
 * - pdf-parse: For processing PDF files.
 *
 * @notes
 * - Both functions accept a Buffer as input and return the extracted text as a Promise<string>.
 * - Ensure that the necessary libraries are installed in your project.
 */

import mammoth from 'mammoth';
import pdfParse from 'pdf-parse';

/**
 * Parses a DOCX file buffer and extracts text content.
 * @param fileBuffer Buffer containing the DOCX file data.
 * @returns A Promise that resolves with the extracted text.
 */
export async function parseDocx(fileBuffer: Buffer): Promise<string> {
  try {
    // Use Mammoth to extract text from the DOCX file buffer
    const result = await mammoth.extractRawText({ buffer: fileBuffer });
    return result.value;
  } catch (error) {
    console.error('Errore nella conversione del file DOCX:', error);
    throw new Error('Impossibile estrarre il testo dal file DOCX.');
  }
}

/**
 * Parses a PDF file buffer and extracts text content.
 * @param fileBuffer Buffer containing the PDF file data.
 * @returns A Promise that resolves with the extracted text.
 */
export async function parsePdf(fileBuffer: Buffer): Promise<string> {
  try {
    // Use pdf-parse to extract text from the PDF file buffer
    const data = await pdfParse(fileBuffer);
    return data.text;
  } catch (error) {
    console.error('Errore nella conversione del file PDF:', error);
    throw new Error('Impossibile estrarre il testo dal file PDF.');
  }
}
