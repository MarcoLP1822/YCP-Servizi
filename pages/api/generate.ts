/**
 * @fileoverview
 * This API endpoint handles AI content generation requests.
 * It expects a POST request with "type" and "extractedText" fields.
 * Based on the "type", it dispatches the request to the appropriate OpenAI service function.
 *
 * Additionally, after a successful generation, it records a log entry detailing
 * the generated content type using the recordLog service.
 *
 * @dependencies
 * - backend/services/openaiService.ts for content generation functions.
 * - backend/services/logService.ts for logging the generation action.
 * - types/api.d.ts for API response types.
 *
 * @notes
 * - Since the endpoint does not enforce authentication, the log entry is recorded using a placeholder user id ("system").
 * - Logging errors are caught and logged to the console without interrupting the response.
 */

import type { NextApiRequest, NextApiResponse } from 'next';
import {
  generateBlurb,
  generateDescription,
  generateKeywords,
  generateCategories,
  generateForeword,
  generateAnalysis,
} from '../../backend/services/openaiService';
import { recordLog } from '../../backend/services/logService';
import type { ApiResponse, GenerateResponse } from '../../types/api';

interface GenerateRequestBody {
  type: 'blurb' | 'description' | 'keywords' | 'categories' | 'foreword' | 'analysis';
  extractedText: string;
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ApiResponse<GenerateResponse>>
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: '', error: 'Metodo non consentito. Utilizzare POST.' });
  }

  try {
    const { type, extractedText } = req.body as GenerateRequestBody;

    if (!type || !extractedText) {
      return res.status(400).json({ message: '', error: 'Campi "type" e "extractedText" sono obbligatori.' });
    }

    let output: string = '';

    // Select the appropriate generation function based on the requested type
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
        return res.status(400).json({ message: '', error: 'Tipo di generazione non supportato.' });
    }

    // Record a log entry for the successful content generation.
    // Since authentication is not enforced here, we use "system" as a placeholder for the user id.
    try {
      await recordLog(
        'system',
        'generate',
        `Generated ${type} content successfully.`,
        { type, output }
      );
    } catch (logError) {
      console.error('Errore nella registrazione del log:', logError);
      // Continue without interrupting the response
    }

    return res.status(200).json({
      message: 'Contenuto generato con successo.',
      data: { output },
    });
  } catch (error: unknown) {
    console.error('Errore nella generazione del contenuto:', error);
    return res.status(500).json({
      message: '',
      error: 'Errore interno del server durante la generazione del contenuto.',
    });
  }
}
