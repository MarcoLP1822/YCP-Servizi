/**
 * @fileoverview
 * Questa pagina gestisce il caricamento dei file, utilizzando il componente FileUploader
 * per consentire agli utenti di selezionare un file (DOCX o PDF) e inviarlo al backend.
 * Il file viene inviato tramite una richiesta POST all'endpoint /api/upload, che lo processa,
 * estrae il testo, esegue l'analisi tecnica e salva i metadati nel database.
 *
 * Key features:
 * - Integrazione con il componente FileUploader per il caricamento tramite drag-and-drop o selezione.
 * - Invio del file al backend utilizzando FormData e fetch.
 * - Visualizzazione dello stato dell'upload, del testo estratto e dei risultati dell'analisi tecnica.
 *
 * @dependencies
 * - React: per la gestione dello stato e degli effetti.
 * - components/Layout.tsx: per la struttura della pagina.
 * - components/FileUploader.tsx: per la selezione e l'upload del file.
 * - context/AppContext: per recuperare il token di autenticazione dell'utente.
 * - backend/services/fileAnalysis.ts: per la funzione di analisi tecnica e il relativo tipo DocumentAnalysis.
 *
 * @notes
 * - L'endpoint /api/upload richiede che l'utente sia autenticato, quindi viene incluso il token JWT
 *   nell'header Authorization se disponibile.
 */

import React, { useState, useContext } from 'react';
import Layout from '../components/Layout';
import FileUploader from '../components/FileUploader';
import { AppContext } from '../context/AppContext';
import { analyzeDocument, DocumentAnalysis } from '../backend/services/fileAnalysis';

const UploadPage: React.FC = () => {
  // Recupera le informazioni utente dal contesto per includere il token JWT nella richiesta
  const { user } = useContext(AppContext) || {};

  // Stato per gestire il messaggio di stato dell'upload
  const [uploadStatus, setUploadStatus] = useState<string>('');
  // Stato per memorizzare il testo estratto dal file caricato
  const [extractedText, setExtractedText] = useState<string>('');
  // Stato per memorizzare l'analisi tecnica del file, con tipo DocumentAnalysis
  const [technicalAnalysis, setTechnicalAnalysis] = useState<DocumentAnalysis | null>(null);

  /**
   * Gestisce l'upload del file chiamando l'endpoint API /api/upload.
   * Utilizza FormData per inviare il file e imposta gli header necessari (incluso il token di autenticazione).
   *
   * @param file Il file selezionato dall'utente.
   */
  const handleFileUpload = async (file: File) => {
    // Crea un oggetto FormData e appende il file con la chiave "file"
    const formData = new FormData();
    formData.append('file', file);

    setUploadStatus('Caricamento in corso...');

    try {
      const response = await fetch('/api/upload', {
        method: 'POST',
        headers: {
          // Aggiunge l'header Authorization se il token è disponibile
          ...(user?.token ? { Authorization: `Bearer ${user.token}` } : {}),
        },
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        setUploadStatus(`Errore: ${errorData.error}`);
        return;
      }

      const data = await response.json();
      setUploadStatus('File caricato con successo!');
      setExtractedText(data.extractedText);
      setTechnicalAnalysis(data.technicalAnalysis);
    } catch (error) {
      console.error('Errore durante l\'upload:', error);
      setUploadStatus('Errore durante il caricamento.');
    }
  };

  return (
    <Layout>
      <h2>Carica il File</h2>
      {/* Utilizza il componente FileUploader per gestire la selezione del file */}
      <FileUploader
        onFileSelect={handleFileUpload}
        maxSize={30 * 1024 * 1024}
        allowedTypes={[
          'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
          'application/pdf',
        ]}
      />
      {uploadStatus && <p>{uploadStatus}</p>}
      {extractedText && (
        <div>
          <h3>Testo Estratto:</h3>
          <pre>{extractedText}</pre>
        </div>
      )}
      {technicalAnalysis && (
        <div>
          <h3>Analisi Tecnica:</h3>
          <pre>{JSON.stringify(technicalAnalysis, null, 2)}</pre>
        </div>
      )}
    </Layout>
  );
};

export default UploadPage;
