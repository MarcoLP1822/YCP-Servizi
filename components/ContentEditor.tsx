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
 * - CSS Modules: per la gestione dei CSS in modo modulare.
 *
 * @notes
 * - Il componente ora utilizza il modulo CSS "ContentEditor.module.css" per i suoi stili.
 */

import React from 'react';
import styles from './ContentEditor.module.css';

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
        className={styles.textarea}
      />
      <button onClick={onRegenerate} className={styles.button}>
        Rigenera Contenuto
      </button>
    </div>
  );
};

export default ContentEditor;
