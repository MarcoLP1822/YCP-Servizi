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
 * - Utilizzo di Material Design per l'interfaccia utente.
 * 
 * @dependencies
 * - React: per la gestione dei componenti.
 * - Next.js: per la gestione delle pagine.
 * - components/Navigation.tsx: per il componente di navigazione.
 * 
 * @notes
 * - Gli stili sono definiti inline per semplicità, da spostare in un file SCSS/CSS-in-JS per progetti reali.
 */

import React, { ReactNode } from 'react';
import Navigation from './Navigation';

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
    <div style={{ display: 'flex', minHeight: '100vh', flexDirection: 'column' }}>
      {/* Header */}
      <header style={{ backgroundColor: '#1976D2', color: '#fff', padding: '1rem' }}>
        <h1 style={{ margin: 0 }}>YCP Servizi</h1>
      </header>

      {/* Main Content Area with Sidebar and Content */}
      <div style={{ flex: 1, display: 'flex' }}>
        {/* Sidebar */}
        <aside style={{ width: '250px', backgroundColor: '#f5f5f5', padding: '1rem' }}>
          <Navigation />
        </aside>

        {/* Content Area */}
        <main style={{ flex: 1, padding: '1rem' }}>
          {children}
        </main>
      </div>

      {/* Footer */}
      <footer style={{ backgroundColor: '#424242', color: '#fff', padding: '0.5rem', textAlign: 'center' }}>
        <small>© {new Date().getFullYear()} YCP Servizi. Tutti i diritti riservati.</small>
      </footer>
    </div>
  );
};

export default Layout;
