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
 * - Gli stili sono di base e possono essere estesi con classi CSS o soluzioni CSS-in-JS.
 */

import React from 'react';
import Link from 'next/link';

const Navigation: React.FC = () => {
  return (
    <nav>
      <ul style={{ listStyleType: 'none', padding: 0 }}>
        <li style={{ marginBottom: '1rem' }}>
          <Link href="/">
            <a style={{ textDecoration: 'none', color: '#1976D2' }}>Dashboard</a>
          </Link>
        </li>
        <li style={{ marginBottom: '1rem' }}>
          <Link href="/upload">
            <a style={{ textDecoration: 'none', color: '#1976D2' }}>Carica il File</a>
          </Link>
        </li>
        <li style={{ marginBottom: '1rem' }}>
          <Link href="/editor">
            <a style={{ textDecoration: 'none', color: '#1976D2' }}>Editor AI</a>
          </Link>
        </li>
      </ul>
    </nav>
  );
};

export default Navigation;
