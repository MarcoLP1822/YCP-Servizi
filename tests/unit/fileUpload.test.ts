/**
 * @fileoverview
 * This file contains unit tests for the file parsing utility functions in
 * backend/services/fileParser.ts. It verifies that DOCX and PDF parsing functions
 * correctly extract text from file buffers and properly handle errors.
 *
 * Key features:
 * - Tests parseDocx using the Mammoth library.
 * - Tests parsePdf using the pdf-parse library.
 *
 * @dependencies
 * - jest: For testing and mocking.
 * - mammoth: Mocked to simulate DOCX parsing.
 * - pdf-parse: Manually mocked to prevent file system access.
 *
 * @notes
 * - The external libraries are mocked to ensure unit tests run reliably.
 * - Both success and error scenarios are covered.
 */

// Manually mock pdf-parse to be a jest mock function
jest.mock('pdf-parse', () => jest.fn());

import { parseDocx, parsePdf } from '../../backend/services/fileParser';
import mammoth from 'mammoth';
import pdfParse from 'pdf-parse';

jest.mock('mammoth');

describe('File Parser Utility Functions', () => {
  describe('parseDocx', () => {
    it('should extract text from a DOCX file buffer', async () => {
      const fakeBuffer = Buffer.from('fake docx data');
      (<jest.Mock>mammoth.extractRawText).mockResolvedValue({ value: 'Extracted DOCX text' });
      const result = await parseDocx(fakeBuffer);
      expect(result).toBe('Extracted DOCX text');
    });

    it('should throw an error if mammoth fails', async () => {
      const fakeBuffer = Buffer.from('fake docx data');
      (<jest.Mock>mammoth.extractRawText).mockRejectedValue(new Error('Mammoth error'));
      await expect(parseDocx(fakeBuffer)).rejects.toThrow('Impossibile estrarre il testo dal file DOCX.');
    });
  });

  describe('parsePdf', () => {
    it('should extract text from a PDF file buffer', async () => {
      const fakeBuffer = Buffer.from('fake pdf data');
      (<jest.Mock>pdfParse).mockResolvedValue({ text: 'Extracted PDF text' });
      const result = await parsePdf(fakeBuffer);
      expect(result).toBe('Extracted PDF text');
    });

    it('should throw an error if pdf-parse fails', async () => {
      const fakeBuffer = Buffer.from('fake pdf data');
      (<jest.Mock>pdfParse).mockRejectedValue(new Error('pdf-parse error'));
      await expect(parsePdf(fakeBuffer)).rejects.toThrow('Impossibile estrarre il testo dal file PDF.');
    });
  });
});
