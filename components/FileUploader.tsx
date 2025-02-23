/**
 * @fileoverview
 * Questo componente gestisce il caricamento dei file tramite supporto drag-and-drop.
 * Consente agli utenti di trascinare e rilasciare il file o cliccare per selezionarlo,
 * con validazione basata sui tipi di file consentiti e la dimensione massima.
 *
 * Key features:
 * - Supporto drag-and-drop, click-to-upload e interazione tramite tastiera.
 * - Validazione del file (dimensione e tipo).
 * - Visualizzazione di messaggi di errore standardizzati utilizzando il componente ErrorMessage.
 *
 * @dependencies
 * - React: per la gestione dello stato e degli eventi.
 * - CSS Modules: per la gestione dei CSS in modo modulare.
 * - components/ErrorMessage.tsx: per visualizzare messaggi di errore in modo consistente.
 *
 * @notes
 * - I parametri onFileSelect, maxSize e allowedTypes devono essere forniti dal componente genitore.
 */

import React, { useState, useRef, DragEvent, ChangeEvent, KeyboardEvent } from 'react';
import styles from './FileUploader.module.css';
import ErrorMessage from './ErrorMessage';

interface FileUploaderProps {
  onFileSelect: (file: File) => void;
  maxSize: number; // dimensione massima in bytes
  allowedTypes: string[];
}

/**
 * Valida il file in base alla dimensione e al tipo.
 * @param file Il file da validare.
 * @returns true se il file è valido, false altrimenti.
 */
const FileUploader: React.FC<FileUploaderProps> = ({ onFileSelect, maxSize, allowedTypes }) => {
  const [dragOver, setDragOver] = useState<boolean>(false);
  const [error, setError] = useState<string>('');
  const fileInputRef = useRef<HTMLInputElement>(null);

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

  const handleFile = (file: File) => {
    if (validateFile(file)) {
      onFileSelect(file);
    }
  };

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setDragOver(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const file = e.dataTransfer.files[0];
      handleFile(file);
      e.dataTransfer.clearData();
    }
  };

  const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setDragOver(true);
  };

  const handleDragLeave = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setDragOver(false);
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      handleFile(file);
    }
  };

  const handleClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      handleClick();
    }
  };

  return (
    <div>
      <div
        onClick={handleClick}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onKeyDown={handleKeyDown}
        role="button"
        tabIndex={0}
        aria-label="Carica il file: trascina qui il file o clicca per selezionarlo"
        className={`${styles.dropArea} ${dragOver ? styles.dragOver : ''}`}
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
      {error && <ErrorMessage message={error} />}
    </div>
  );
};

export default FileUploader;
