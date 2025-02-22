/**
 * @fileoverview
 * Questo componente gestisce la navigazione laterale dell'applicazione.
 * Include link alle pagine principali: Dashboard, Caricamento file e Editor.
 * 
 * Key features:
 * - Navigazione semplice e intuitiva.
 * - Testi in italiano per l'interfaccia.
 * 
 * @dependencies
 * - React: per la gestione dei componenti.
 * - Next.js Link: per la navigazione client-side.
 * 
 * @notes
 * - Rimosso il tag <a> interno a <Link> per evitare l'errore "Invalid <Link> with <a> child".
 * - Ora passiamo lo stile direttamente a <Link>.
 */

import React from 'react';
import Link from 'next/link';

const Navigation: React.FC = () => {
  return (
    <nav>
      <ul style={{ listStyleType: 'none', padding: 0 }}>
        <li style={{ marginBottom: '1rem' }}>
          <Link href="/" style={{ textDecoration: 'none', color: '#1976D2' }}>
            Dashboard
          </Link>
        </li>
        <li style={{ marginBottom: '1rem' }}>
          <Link href="/upload" style={{ textDecoration: 'none', color: '#1976D2' }}>
            Carica il File
          </Link>
        </li>
        <li style={{ marginBottom: '1rem' }}>
          <Link href="/editor" style={{ textDecoration: 'none', color: '#1976D2' }}>
            Editor AI
          </Link>
        </li>
      </ul>
    </nav>
  );
};

export default Navigation;
