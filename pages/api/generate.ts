/**
 * @fileoverview
 * This API endpoint handles AI content generation requests.
 * It expects a POST request with the following JSON body:
 * {
 *   "type": "blurb" | "description" | "keywords" | "categories" | "foreword" | "analysis",
 *   "extractedText": "The text extracted from the uploaded book file"
 * }
 *
 * The endpoint calls the OpenAI service to generate the requested content based on a tailored prompt.
 * The generated content is returned as a JSON response.
 *
 * @dependencies
 * - backend/services/openaiService.ts: Provides the generateContent function to interact with the OpenAI API.
 *
 * @notes
 * - Ensure that the OPENAI_API_KEY environment variable is set.
 * - Only POST requests are allowed.
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

    // Optionally, here you could store the result in the database associated with the file, etc.
    // For now, we simply return the generated content.
    return res.status(200).json({
      message: 'Contenuto generato con successo.',
      output: aiOutput,
    });
  } catch (error: any) {
    console.error('Errore nella generazione del contenuto:', error);
    return res.status(500).json({
      error: 'Errore interno del server durante la generazione del contenuto.',
    });
  }
}
