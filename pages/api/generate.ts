/**
 * @fileoverview
 * This API endpoint handles AI content generation requests.
 * It expects a POST request with "type" and "extractedText" fields.
 * The endpoint dispatches the request to the appropriate content generation function
 * in the modularized OpenAI service.
 *
 * Key features:
 * - Supports generation types: blurb, description, keywords, categories, foreword, analysis.
 * - Returns generated content or error responses.
 *
 * @dependencies
 * - Functions from backend/services/openaiService.ts for content generation.
 *
 * @notes
 * - Ensure that the incoming request has valid "type" and "extractedText" fields.
 */

import type { NextApiRequest, NextApiResponse } from 'next';
import { generateBlurb, generateDescription, generateKeywords, generateCategories, generateForeword, generateAnalysis } from '../../backend/services/openaiService';

interface GenerateRequestBody {
  type: 'blurb' | 'description' | 'keywords' | 'categories' | 'foreword' | 'analysis';
  extractedText: string;
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Metodo non consentito. Utilizzare POST.' });
  }

  try {
    const { type, extractedText } = req.body as GenerateRequestBody;

    if (!type || !extractedText) {
      return res.status(400).json({ error: 'Campi "type" e "extractedText" sono obbligatori.' });
    }

    let output: string = '';

    switch (type) {
      case 'blurb':
        output = await generateBlurb(extractedText);
        break;
      case 'description':
        output = await generateDescription(extractedText);
        break;
      case 'keywords':
        output = await generateKeywords(extractedText);
        break;
      case 'categories':
        output = await generateCategories(extractedText);
        break;
      case 'foreword':
        output = await generateForeword(extractedText);
        break;
      case 'analysis':
        output = await generateAnalysis(extractedText);
        break;
      default:
        return res.status(400).json({ error: 'Tipo di generazione non supportato.' });
    }

    return res.status(200).json({
      message: 'Contenuto generato con successo.',
      output,
    });
  } catch (error: unknown) {
    console.error('Errore nella generazione del contenuto:', error);
    return res.status(500).json({ error: 'Errore interno del server durante la generazione del contenuto.' });
  }
}
