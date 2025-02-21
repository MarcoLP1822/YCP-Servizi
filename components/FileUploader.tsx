/**
 * @fileoverview
 * Questo componente gestisce il caricamento dei file tramite supporto drag-and-drop.
 * Consente agli utenti di trascinare e rilasciare il file o cliccare per selezionarlo,
 * con validazione basata sui tipi di file consentiti e la dimensione massima.
 *
 * Key features:
 * - Supporto drag-and-drop e click-to-upload.
 * - Validazione del file (dimensione e tipo).
 * - Visualizzazione di messaggi di errore se la validazione fallisce.
 *
 * @dependencies
 * - React: per la gestione dello stato e degli eventi.
 *
 * @notes
 * - I parametri onFileSelect, maxSize e allowedTypes devono essere forniti dal componente genitore.
 */

import React, { useState, useRef, DragEvent, ChangeEvent } from 'react';

interface FileUploaderProps {
  onFileSelect: (file: File) => void;
  maxSize: number; // dimensione massima in bytes
  allowedTypes: string[];
}

const FileUploader: React.FC<FileUploaderProps> = ({ onFileSelect, maxSize, allowedTypes }) => {
  const [dragOver, setDragOver] = useState<boolean>(false);
  const [error, setError] = useState<string>('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  /**
   * Valida il file in base alla dimensione e al tipo.
   * @param file Il file da validare.
   * @returns true se il file è valido, false altrimenti.
   */
  const validateFile = (file: File): boolean => {
    if (file.size > maxSize) {
      setError(`Il file supera il limite di ${maxSize / (1024 * 1024)}MB.`);
      return false;
    }
    if (!allowedTypes.includes(file.type)) {
      setError('Tipo di file non supportato.');
      return false;
    }
    setError('');
    return true;
  };

  /**
   * Gestisce il file se la validazione ha successo.
   * @param file Il file da processare.
   */
  const handleFile = (file: File) => {
    if (validateFile(file)) {
      onFileSelect(file);
    }
  };

  /**
   * Gestisce l'evento di drop dei file.
   */
  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setDragOver(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const file = e.dataTransfer.files[0];
      handleFile(file);
      e.dataTransfer.clearData();
    }
  };

  /**
   * Gestisce l'evento di trascinamento sopra l'area di drop.
   */
  const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setDragOver(true);
  };

  /**
   * Gestisce l'evento di uscita del trascinamento dall'area di drop.
   */
  const handleDragLeave = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setDragOver(false);
  };

  /**
   * Gestisce il cambio del file tramite input.
   */
  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      handleFile(file);
    }
  };

  /**
   * Attiva il click sul file input nascosto.
   */
  const handleClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  return (
    <div>
      <div
        onClick={handleClick}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        style={{
          border: '2px dashed #1976D2',
          borderRadius: '4px',
          padding: '20px',
          textAlign: 'center',
          backgroundColor: dragOver ? '#e3f2fd' : '#fff',
          cursor: 'pointer'
        }}
      >
        <p>Trascina qui il file o clicca per selezionarlo</p>
      </div>
      <input
        type="file"
        ref={fileInputRef}
        style={{ display: 'none' }}
        onChange={handleFileChange}
        accept={allowedTypes.join(',')}
      />
      {error && <p style={{ color: 'red' }}>{error}</p>}
    </div>
  );
};

export default FileUploader;
