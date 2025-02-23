/**
 * @fileoverview
 * This component defines the main layout of the application.
 * It includes a header, sidebar (with navigation), content area, and footer.
 * 
 * Key features:
 * - Uses a responsive grid layout defined in Layout.module.css.
 * - On smaller screens, the sidebar and content stack vertically.
 * 
 * @notes
 * - The responsive behavior is managed by the CSS media queries in Layout.module.css.
 */

import React, { ReactNode } from 'react';
import Navigation from './Navigation';
import styles from './Layout.module.css';

interface LayoutProps {
  children: ReactNode;
}

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
