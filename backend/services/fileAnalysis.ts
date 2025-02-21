/**
 * @fileoverview
 * Questo file fornisce funzioni di analisi tecnica per i file dei documenti.
 * La funzione principale, `analyzeDocument`, estrae statistiche di base come:
 * - Conteggio delle parole
 * - Conteggio dei caratteri
 * - Conteggio delle frasi
 * - Lunghezza media delle parole
 *
 * Queste informazioni possono essere utili per fornire feedback tecnici agli utenti
 * sui loro file, ad esempio per identificare possibili problemi di formattazione o complessità del testo.
 *
 * @dependencies
 * - Nessuna libreria esterna, utilizza solo metodi JavaScript nativi.
 *
 * @notes
 * - L'analisi si basa esclusivamente sul testo estratto.
 * - In caso di input vuoto o non valido, tutti i valori restituiti saranno pari a zero.
 */

export interface DocumentAnalysis {
    wordCount: number;
    characterCount: number;
    sentenceCount: number;
    averageWordLength: number;
  }
  
  /**
   * Analizza il testo di un documento e restituisce statistiche di base.
   *
   * @param extractedText - Il testo estratto dal file del documento.
   * @returns Un oggetto di tipo DocumentAnalysis contenente:
   *  - wordCount: Numero totale di parole.
   *  - characterCount: Numero totale di caratteri.
   *  - sentenceCount: Numero di frasi individuate.
   *  - averageWordLength: Lunghezza media delle parole.
   */
  export function analyzeDocument(extractedText: string): DocumentAnalysis {
    // Rimuove eventuali spazi bianchi in eccesso.
    const text = extractedText.trim();
    if (!text) {
      return { wordCount: 0, characterCount: 0, sentenceCount: 0, averageWordLength: 0 };
    }
  
    // Conta il numero totale di caratteri.
    const characterCount = text.length;
  
    // Suddivide il testo in parole usando una regex che separa per spazi.
    const words = text.split(/\s+/).filter(word => word.length > 0);
    const wordCount = words.length;
  
    // Calcola la lunghezza media delle parole.
    const totalWordLength = words.reduce((acc, word) => acc + word.length, 0);
    const averageWordLength = wordCount > 0 ? totalWordLength / wordCount : 0;
  
    // Suddivide il testo in frasi basandosi sui segni di punteggiatura: punto, punto esclamativo o punto interrogativo.
    const sentences = text.split(/[.!?]+/).filter(sentence => sentence.trim().length > 0);
    const sentenceCount = sentences.length;
  
    return {
      wordCount,
      characterCount,
      sentenceCount,
      averageWordLength,
    };
  }
  