/**
 * @fileoverview
 * Questo componente fornisce un editor di testo per i contenuti generati dall'AI.
 * Consente agli utenti di modificare il contenuto e di rigenerarlo tramite un pulsante.
 *
 * Key features:
 * - Area di testo per la modifica del contenuto.
 * - Pulsante per rigenerare il contenuto.
 *
 * @dependencies
 * - React: per la gestione degli eventi e dello stato.
 *
 * @notes
 * - L'implementazione attuale utilizza una textarea semplice.
 *   In futuro si può integrare un editor di testo avanzato (ad es. react-quill).
 */

import React from 'react';

interface ContentEditorProps {
  content: string;
  onChange: (value: string) => void;
  onRegenerate: () => void;
}

const ContentEditor: React.FC<ContentEditorProps> = ({ content, onChange, onRegenerate }) => {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      <textarea
        value={content}
        onChange={(e) => onChange(e.target.value)}
        rows={10}
        style={{
          width: '100%',
          padding: '1rem',
          borderRadius: '4px',
          border: '1px solid #ccc',
          fontSize: '16px',
          fontFamily: 'Roboto, sans-serif'
        }}
      />
      <button
        onClick={onRegenerate}
        style={{
          alignSelf: 'flex-start',
          backgroundColor: '#FFC107',
          color: '#000',
          padding: '0.5rem 1rem',
          border: 'none',
          borderRadius: '4px',
          cursor: 'pointer'
        }}
      >
        Rigenera Contenuto
      </button>
    </div>
  );
};

export default ContentEditor;
