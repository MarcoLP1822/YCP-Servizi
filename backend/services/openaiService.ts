/**
 * @fileoverview
 * This service handles interactions with the OpenAI API.
 * It defines a function to generate AI content based on the provided text and content type.
 *
 * Key features:
 * - Constructs a tailored prompt for each generation type (blurb, description, keywords, categories, foreword, analysis).
 * - Calls the OpenAI Chat Completion API using the provided API key from environment variables.
 * - Handles errors and returns the generated content.
 * - Supports per-functionality configuration for temperature and max tokens via specific environment variables.
 *
 * @dependencies
 * - fetch (native in Node.js or via polyfill in Next.js) for HTTP requests.
 *
 * @notes
 * - Ensure that the environment variable OPENAI_API_KEY is set.
 * - Optional environment variables:
 *    - OPENAI_BLURB_TEMPERATURE, OPENAI_BLURB_MAX_TOKENS
 *    - OPENAI_DESCRIPTION_TEMPERATURE, OPENAI_DESCRIPTION_MAX_TOKENS
 *    - OPENAI_KEYWORDS_TEMPERATURE, OPENAI_KEYWORDS_MAX_TOKENS
 *    - OPENAI_CATEGORIES_TEMPERATURE, OPENAI_CATEGORIES_MAX_TOKENS
 *    - OPENAI_FOREWORD_TEMPERATURE, OPENAI_FOREWORD_MAX_TOKENS
 *    - OPENAI_ANALYSIS_TEMPERATURE, OPENAI_ANALYSIS_MAX_TOKENS
 * - This module assumes usage of the "gpt-3.5-turbo" model.
 */

// Define the GenerationType for the different content generation options
export type GenerationType =
  | 'blurb'
  | 'description'
  | 'keywords'
  | 'categories'
  | 'foreword'
  | 'analysis';

// Retrieve the global API key from environment variables
const OPENAI_API_KEY: string = process.env.OPENAI_API_KEY || '';

// Define a mapping for per-generation-type configuration settings
const generationConfig: Record<GenerationType, { temperature: number; max_tokens: number }> = {
  blurb: {
    temperature: process.env.OPENAI_BLURB_TEMPERATURE
      ? parseFloat(process.env.OPENAI_BLURB_TEMPERATURE)
      : 0.7,
    max_tokens: process.env.OPENAI_BLURB_MAX_TOKENS
      ? parseInt(process.env.OPENAI_BLURB_MAX_TOKENS, 10)
      : 500,
  },
  description: {
    temperature: process.env.OPENAI_DESCRIPTION_TEMPERATURE
      ? parseFloat(process.env.OPENAI_DESCRIPTION_TEMPERATURE)
      : 0.7,
    max_tokens: process.env.OPENAI_DESCRIPTION_MAX_TOKENS
      ? parseInt(process.env.OPENAI_DESCRIPTION_MAX_TOKENS, 10)
      : 500,
  },
  keywords: {
    temperature: process.env.OPENAI_KEYWORDS_TEMPERATURE
      ? parseFloat(process.env.OPENAI_KEYWORDS_TEMPERATURE)
      : 0.5,
    max_tokens: process.env.OPENAI_KEYWORDS_MAX_TOKENS
      ? parseInt(process.env.OPENAI_KEYWORDS_MAX_TOKENS, 10)
      : 150,
  },
  categories: {
    temperature: process.env.OPENAI_CATEGORIES_TEMPERATURE
      ? parseFloat(process.env.OPENAI_CATEGORIES_TEMPERATURE)
      : 0.6,
    max_tokens: process.env.OPENAI_CATEGORIES_MAX_TOKENS
      ? parseInt(process.env.OPENAI_CATEGORIES_MAX_TOKENS, 10)
      : 200,
  },
  foreword: {
    temperature: process.env.OPENAI_FOREWORD_TEMPERATURE
      ? parseFloat(process.env.OPENAI_FOREWORD_TEMPERATURE)
      : 0.7,
    max_tokens: process.env.OPENAI_FOREWORD_MAX_TOKENS
      ? parseInt(process.env.OPENAI_FOREWORD_MAX_TOKENS, 10)
      : 400,
  },
  analysis: {
    temperature: process.env.OPENAI_ANALYSIS_TEMPERATURE
      ? parseFloat(process.env.OPENAI_ANALYSIS_TEMPERATURE)
      : 0.8,
    max_tokens: process.env.OPENAI_ANALYSIS_MAX_TOKENS
      ? parseInt(process.env.OPENAI_ANALYSIS_MAX_TOKENS, 10)
      : 600,
  },
};

/**
 * Generates AI content based on the provided type and extracted text.
 *
 * @param type - The type of content to generate (e.g., "blurb", "description", etc.).
 * @param extractedText - The text extracted from the uploaded book file.
 * @returns A promise that resolves to the generated content as a string.
 *
 * @throws Will throw an error if the API call fails or if the response is invalid.
 */
export async function generateContent(
  type: GenerationType,
  extractedText: string
): Promise<string> {
  // Define tailored prompts for each content type in Italian.
  let prompt = '';

  switch (type) {
    case 'blurb':
      prompt = `Genera un testo accattivante per la copertina posteriore del libro basandoti sul seguente contenuto:\n\n${extractedText}`;
      break;
    case 'description':
      prompt = `Genera una descrizione convincente per la pagina prodotto di un libro (ad esempio, su Amazon) basata sul seguente contenuto:\n\n${extractedText}`;
      break;
    case 'keywords':
      prompt = `Genera un insieme di parole chiave rilevanti per il libro basato sul seguente contenuto:\n\n${extractedText}`;
      break;
    case 'categories':
      prompt = `Assegna una categoria principale e due sottocategorie per il libro dal catalogo, basandoti sul seguente contenuto:\n\n${extractedText}\n\nRispondi in formato JSON con "main" per la categoria principale e "sub" come array per le sottocategorie.`;
      break;
    case 'foreword':
      prompt = `Genera un prologo coinvolgente per il libro basandoti sul seguente contenuto:\n\n${extractedText}`;
      break;
    case 'analysis':
      prompt = `Fornisci un'analisi approfondita del libro basandoti sul seguente contenuto:\n\n${extractedText}`;
      break;
    default:
      throw new Error('Tipo di generazione non supportato.');
  }

  // Ensure the API key is available
  if (!OPENAI_API_KEY) {
    throw new Error('La chiave API OpenAI non è impostata. Verifica la configurazione.');
  }

  // Get the configuration for the current generation type
  const { temperature, max_tokens } = generationConfig[type];

  // Prepare the request payload for the OpenAI API call
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
    // Make the API call to OpenAI
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        // Use the API key from environment variables
        Authorization: `Bearer ${OPENAI_API_KEY}`,
      },
      body: JSON.stringify(requestBody),
    });

    // If the response is not OK, throw an error with details
    if (!response.ok) {
      const errorDetails = await response.text();
      throw new Error(
        `Errore nella chiamata all'API OpenAI: ${response.status} - ${errorDetails}`
      );
    }

    // Parse the JSON response from the API
    const data = await response.json();

    // Extract the generated text from the API response
    const generatedText = data.choices && data.choices[0]?.message?.content;
    if (!generatedText) {
      throw new Error('Risposta dell\'API OpenAI non valida.');
    }

    // Return the generated content
    return generatedText;
  } catch (error: any) {
    console.error('Errore durante la generazione del contenuto:', error);
    throw new Error('Impossibile generare il contenuto al momento.');
  }
}
