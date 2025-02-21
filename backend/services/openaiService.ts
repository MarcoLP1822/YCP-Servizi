/**
 * @fileoverview
 * This service handles interactions with the OpenAI API.
 * It defines a function to generate AI content based on the provided text and content type.
 *
 * Key features:
 * - Constructs a tailored prompt for each generation type (blurb, description, keywords, categories, foreword, analysis).
 * - Calls the OpenAI Chat Completion API using the provided API key from environment variables.
 * - Handles errors and returns the generated content.
 *
 * @dependencies
 * - fetch (native in Node.js or via polyfill in Next.js) for HTTP requests.
 *
 * @notes
 * - Ensure that the environment variable OPENAI_API_KEY is set.
 * - This module assumes usage of the "gpt-3.5-turbo" model.
 */

export type GenerationType =
  | 'blurb'
  | 'description'
  | 'keywords'
  | 'categories'
  | 'foreword'
  | 'analysis';

/**
 * Generates AI content based on the provided type and extracted text.
 *
 * @param type - The type of content to generate (e.g., "blurb", "description", etc.).
 * @param extractedText - The text extracted from the uploaded book file.
 * @returns A promise that resolves to the generated content as a string.
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

  // Call the OpenAI API
  try {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        // Ensure the OPENAI_API_KEY is set in your environment variables
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: 'gpt-3.5-turbo',
        messages: [
          // Optional system message to set the tone or instructions
          {
            role: 'system',
            content: 'Sei un assistente esperto nella generazione di contenuti per libri in italiano.',
          },
          {
            role: 'user',
            content: prompt,
          },
        ],
        temperature: 0.7,
        max_tokens: 500,
      }),
    });

    if (!response.ok) {
      const errorDetails = await response.text();
      throw new Error(
        `Errore nella chiamata all'API OpenAI: ${response.status} - ${errorDetails}`
      );
    }

    const data = await response.json();

    // Extract the generated message content from the API response
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
