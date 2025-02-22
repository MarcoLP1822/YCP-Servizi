/**
 * @fileoverview
 * This service handles interactions with the OpenAI API for generating AI content.
 * This version has been modularized to provide separate functions for each content type:
 * - generateBlurb, generateDescription, generateKeywords, generateCategories, generateForeword, generateAnalysis.
 * Each function constructs a tailored prompt and calls a private helper function to perform the API call.
 *
 * Key features:
 * - Modular functions for each content generation type.
 * - Centralized helper function for API calls, ensuring consistent error handling and configuration.
 *
 * @dependencies
 * - fetch (native in Node.js or via polyfill in Next.js) for HTTP requests.
 *
 * @notes
 * - Ensure that the environment variable OPENAI_API_KEY is set.
 * - Configuration for temperature and max_tokens is handled via environment variables with defaults.
 */

export type GenerationType = 'blurb' | 'description' | 'keywords' | 'categories' | 'foreword' | 'analysis';

// Retrieve the global API key from environment variables
const OPENAI_API_KEY: string = process.env.OPENAI_API_KEY || '';

// Define a mapping for per-generation-type configuration settings
const generationConfig: Record<GenerationType, { temperature: number; max_tokens: number }> = {
  blurb: {
    temperature: process.env.OPENAI_BLURB_TEMPERATURE ? parseFloat(process.env.OPENAI_BLURB_TEMPERATURE) : 0.7,
    max_tokens: process.env.OPENAI_BLURB_MAX_TOKENS ? parseInt(process.env.OPENAI_BLURB_MAX_TOKENS, 10) : 500,
  },
  description: {
    temperature: process.env.OPENAI_DESCRIPTION_TEMPERATURE ? parseFloat(process.env.OPENAI_DESCRIPTION_TEMPERATURE) : 0.7,
    max_tokens: process.env.OPENAI_DESCRIPTION_MAX_TOKENS ? parseInt(process.env.OPENAI_DESCRIPTION_MAX_TOKENS, 10) : 500,
  },
  keywords: {
    temperature: process.env.OPENAI_KEYWORDS_TEMPERATURE ? parseFloat(process.env.OPENAI_KEYWORDS_TEMPERATURE) : 0.5,
    max_tokens: process.env.OPENAI_KEYWORDS_MAX_TOKENS ? parseInt(process.env.OPENAI_KEYWORDS_MAX_TOKENS, 10) : 150,
  },
  categories: {
    temperature: process.env.OPENAI_CATEGORIES_TEMPERATURE ? parseFloat(process.env.OPENAI_CATEGORIES_TEMPERATURE) : 0.6,
    max_tokens: process.env.OPENAI_CATEGORIES_MAX_TOKENS ? parseInt(process.env.OPENAI_CATEGORIES_MAX_TOKENS, 10) : 200,
  },
  foreword: {
    temperature: process.env.OPENAI_FOREWORD_TEMPERATURE ? parseFloat(process.env.OPENAI_FOREWORD_TEMPERATURE) : 0.7,
    max_tokens: process.env.OPENAI_FOREWORD_MAX_TOKENS ? parseInt(process.env.OPENAI_FOREWORD_MAX_TOKENS, 10) : 400,
  },
  analysis: {
    temperature: process.env.OPENAI_ANALYSIS_TEMPERATURE ? parseFloat(process.env.OPENAI_ANALYSIS_TEMPERATURE) : 0.8,
    max_tokens: process.env.OPENAI_ANALYSIS_MAX_TOKENS ? parseInt(process.env.OPENAI_ANALYSIS_MAX_TOKENS, 10) : 600,
  },
};

/**
 * Private helper function to generate content using the OpenAI API.
 *
 * @param prompt - The prompt to send to the API.
 * @param type - The generation type, used for configuration.
 * @returns A promise that resolves with the generated content as a string.
 * @throws Will throw an error if the API call fails or the response is invalid.
 */
async function _generateContent(prompt: string, type: GenerationType): Promise<string> {
  if (!OPENAI_API_KEY) {
    throw new Error('La chiave API OpenAI non è impostata. Verifica la configurazione.');
  }

  const { temperature, max_tokens } = generationConfig[type];

  const requestBody = {
    model: 'gpt-3.5-turbo',
    messages: [
      {
        role: 'system',
        content: 'Sei un assistente esperto nella generazione di contenuti per libri in italiano.',
      },
      {
        role: 'user',
        content: prompt,
      },
    ],
    temperature,
    max_tokens,
  };

  try {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${OPENAI_API_KEY}`,
      },
      body: JSON.stringify(requestBody),
    });

    if (!response.ok) {
      const errorDetails = await response.text();
      throw new Error(`Errore nella chiamata all'API OpenAI: ${response.status} - ${errorDetails}`);
    }

    const data = await response.json();
    const generatedText = data.choices && data.choices[0]?.message?.content;
    if (!generatedText) {
      throw new Error('Risposta dell\'API OpenAI non valida.');
    }

    return generatedText;
  } catch (error: any) {
    console.error('Errore durante la generazione del contenuto:', error);
    throw new Error('Impossibile generare il contenuto al momento.');
  }
}

/**
 * Generates a book blurb.
 *
 * @param extractedText - The extracted text from the book.
 * @returns A promise that resolves with the generated blurb.
 */
export async function generateBlurb(extractedText: string): Promise<string> {
  const prompt = `Genera un testo accattivante per la copertina posteriore del libro basandoti sul seguente contenuto:\n\n${extractedText}`;
  return _generateContent(prompt, 'blurb');
}

/**
 * Generates a book description.
 *
 * @param extractedText - The extracted text from the book.
 * @returns A promise that resolves with the generated description.
 */
export async function generateDescription(extractedText: string): Promise<string> {
  const prompt = `Genera una descrizione convincente per la pagina prodotto di un libro (ad esempio, su Amazon) basata sul seguente contenuto:\n\n${extractedText}`;
  return _generateContent(prompt, 'description');
}

/**
 * Generates a set of keywords for the book.
 *
 * @param extractedText - The extracted text from the book.
 * @returns A promise that resolves with the generated keywords.
 */
export async function generateKeywords(extractedText: string): Promise<string> {
  const prompt = `Genera un insieme di parole chiave rilevanti per il libro basato sul seguente contenuto:\n\n${extractedText}`;
  return _generateContent(prompt, 'keywords');
}

/**
 * Generates categories for the book.
 *
 * @param extractedText - The extracted text from the book.
 * @returns A promise that resolves with the generated categories in JSON format.
 */
export async function generateCategories(extractedText: string): Promise<string> {
  const prompt = `Assegna una categoria principale e due sottocategorie per il libro dal catalogo, basandoti sul seguente contenuto:\n\n${extractedText}\n\nRispondi in formato JSON con "main" per la categoria principale e "sub" come array per le sottocategorie.`;
  return _generateContent(prompt, 'categories');
}

/**
 * Generates a foreword for the book.
 *
 * @param extractedText - The extracted text from the book.
 * @returns A promise that resolves with the generated foreword.
 */
export async function generateForeword(extractedText: string): Promise<string> {
  const prompt = `Genera un prologo coinvolgente per il libro basandoti sul seguente contenuto:\n\n${extractedText}`;
  return _generateContent(prompt, 'foreword');
}

/**
 * Generates an in-depth analysis of the book.
 *
 * @param extractedText - The extracted text from the book.
 * @returns A promise that resolves with the generated analysis.
 */
export async function generateAnalysis(extractedText: string): Promise<string> {
  const prompt = `Fornisci un'analisi approfondita del libro basandoti sul seguente contenuto:\n\n${extractedText}`;
  return _generateContent(prompt, 'analysis');
}
