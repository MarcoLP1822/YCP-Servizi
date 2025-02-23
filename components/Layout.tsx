/**
 * @fileoverview
 * Questo componente definisce il layout principale dell'applicazione.
 * Esso include:
 * - Header: con branding e titolo.
 * - Sidebar: per la navigazione, integrato tramite il componente Navigation.
 * - Main Content: area per il contenuto principale delle pagine.
 * - Footer: informazioni di copyright.
 *
 * Key features:
 * - Layout responsive con struttura a griglia.
 * - Utilizzo di CSS Modules per una migliore organizzazione degli stili.
 *
 * @dependencies
 * - React: per la gestione dei componenti.
 * - Next.js: per la gestione delle pagine.
 * - components/Navigation.tsx: per il componente di navigazione.
 */

import React, { ReactNode } from 'react';
import Navigation from './Navigation';
import styles from './Layout.module.css';

interface LayoutProps {
  children: ReactNode;
}

/**
 * Layout principale dell'applicazione.
 * @param {LayoutProps} props - Props contenenti i componenti figli.
 * @returns Il layout completo con header, sidebar, area principale e footer.
 */
const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <div className={styles.container}>
      {/* Header */}
      <header className={styles.header}>
        <h1 style={{ margin: 0 }}>YCP Servizi</h1>
      </header>

      {/* Main Content Area with Sidebar and Content */}
      <div className={styles.mainArea}>
        {/* Sidebar */}
        <aside className={styles.sidebar}>
          <Navigation />
        </aside>

        {/* Content Area */}
        <main className={styles.content}>
          {children}
        </main>
      </div>

      {/* Footer */}
      <footer className={styles.footer}>
        <small>© {new Date().getFullYear()} YCP Servizi. Tutti i diritti riservati.</small>
      </footer>
    </div>
  );
};

export default Layout;
