/**
 * @fileoverview
 * Questo endpoint API gestisce la generazione di contenuti AI.
 * Riceve una richiesta POST con "type" ed "extractedText" e restituisce il contenuto generato tramite il servizio OpenAI.
 *
 * @dependencies
 * - backend/services/openaiService.ts per interagire con l'API OpenAI.
 *
 * @notes
 * - Gli errori sono gestiti con "unknown" per conformarsi alle regole ESLint.
 */

import type { NextApiRequest, NextApiResponse } from 'next';
import { generateContent, GenerationType } from '../../backend/services/openaiService';

interface GenerateRequestBody {
  type: GenerationType;
  extractedText: string;
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  // Allow only POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Metodo non consentito. Utilizzare POST.' });
  }

  try {
    // Parse the request body
    const { type, extractedText } = req.body as GenerateRequestBody;

    // Validate required fields
    if (!type || !extractedText) {
      return res.status(400).json({ error: 'Campi "type" e "extractedText" sono obbligatori.' });
    }

    // Call the OpenAI service to generate content based on the type and extracted text
    const aiOutput = await generateContent(type, extractedText);

    // Return the generated content
    return res.status(200).json({
      message: 'Contenuto generato con successo.',
      output: aiOutput,
    });
  } catch (error: unknown) {
    console.error('Errore nella generazione del contenuto:', error);
    return res.status(500).json({
      error: 'Errore interno del server durante la generazione del contenuto.',
    });
  }
}
