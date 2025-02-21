/**
 * @fileoverview
 * Questa pagina gestisce il caricamento dei file.
 * Utilizza il componente Layout per mantenere una struttura coerente.
 * 
 * Key features:
 * - Form per il caricamento dei file.
 * - Istruzioni in italiano per l'utente.
 * 
 * @dependencies
 * - React: per la gestione dei componenti.
 * - components/Layout.tsx: per il layout dell'applicazione.
 * 
 * @notes
 * - Il form è di base e in seguito verrà sostituito o integrato con un componente FileUploader.
 */

import React, { useState, ChangeEvent } from 'react';
import Layout from '../components/Layout';

const UploadPage: React.FC = () => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  /**
   * Gestisce il cambiamento dell'input file.
   * @param event L'evento di selezione del file.
   */
  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      setSelectedFile(event.target.files[0]);
    }
  };

  /**
   * Funzione di submit del form.
   * Attualmente mostra solo un alert con il nome del file selezionato.
   * In futuro verrà integrato il caricamento sul server.
   * @param event L'evento di submit del form.
   */
  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    if (selectedFile) {
      alert(`File selezionato: ${selectedFile.name}`);
      // In futuro: Inviare il file al backend tramite API.
    } else {
      alert('Nessun file selezionato.');
    }
  };

  return (
    <Layout>
      <h2>Carica il File</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="fileUpload">Seleziona un file (DOCX o PDF, max 30MB): </label>
          <input type="file" id="fileUpload" accept=".docx,application/pdf" onChange={handleFileChange} />
        </div>
        <button type="submit" style={{ marginTop: '1rem', backgroundColor: '#1976D2', color: '#fff', padding: '0.5rem 1rem', border: 'none', borderRadius: '4px' }}>
          Carica
        </button>
      </form>
    </Layout>
  );
};

export default UploadPage;
