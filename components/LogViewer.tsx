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
 *
 * @notes
 * - I dati dei log devono essere forniti come proprietà (props) in un array di oggetti
 *   che contengono i campi log_id, timestamp, action_type e description.
 */

import React from 'react';

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
    <div style={{ overflowY: 'auto', maxHeight: '400px' }}>
      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr>
            <th style={{ borderBottom: '1px solid #ccc', padding: '8px', textAlign: 'left' }}>Timestamp</th>
            <th style={{ borderBottom: '1px solid #ccc', padding: '8px', textAlign: 'left' }}>Azione</th>
            <th style={{ borderBottom: '1px solid #ccc', padding: '8px', textAlign: 'left' }}>Descrizione</th>
          </tr>
        </thead>
        <tbody>
          {logs.map((log) => (
            <tr key={log.log_id}>
              <td style={{ borderBottom: '1px solid #eee', padding: '8px' }}>
                {new Date(log.timestamp).toLocaleString()}
              </td>
              <td style={{ borderBottom: '1px solid #eee', padding: '8px' }}>
                {log.action_type}
              </td>
              <td style={{ borderBottom: '1px solid #eee', padding: '8px' }}>
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
