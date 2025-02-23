/**
 * @fileoverview
 * Questo componente visualizza una lista di log degli utenti in formato tabellare.
 * Viene utilizzato per mostrare dettagliatamente le azioni compiute dagli utenti.
 *
 * Key features:
 * - Visualizzazione dei log con timestamp, tipo di azione e descrizione.
 * - Area scrollabile per gestire un numero elevato di log.
 *
 * @dependencies
 * - React: per il rendering degli elementi della lista.
 * - CSS Modules: per la gestione dei CSS in modo modulare.
 *
 * @notes
 * - I dati dei log devono essere forniti come proprietà (props) in un array di oggetti
 *   che contengono i campi log_id, timestamp, action_type e description.
 */

import React from 'react';
import styles from './LogViewer.module.css';

interface Log {
  log_id: string;
  timestamp: string;
  action_type: string;
  description: string;
}

interface LogViewerProps {
  logs: Log[];
}

const LogViewer: React.FC<LogViewerProps> = ({ logs }) => {
  return (
    <div className={styles.container}>
      <table className={styles.table}>
        <thead>
          <tr>
            <th className={styles.th}>Timestamp</th>
            <th className={styles.th}>Azione</th>
            <th className={styles.th}>Descrizione</th>
          </tr>
        </thead>
        <tbody>
          {logs.map((log) => (
            <tr key={log.log_id}>
              <td className={styles.td}>
                {new Date(log.timestamp).toLocaleString()}
              </td>
              <td className={styles.td}>
                {log.action_type}
              </td>
              <td className={styles.td}>
                {log.description}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default LogViewer;
