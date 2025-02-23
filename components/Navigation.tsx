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
 * - CSS Modules: per la gestione dei CSS in modo modulare.
 *
 * @notes
 * - Ora lo stile viene gestito tramite il modulo CSS "Navigation.module.css".
 */

import React from 'react';
import Link from 'next/link';
import styles from './Navigation.module.css';

const Navigation: React.FC = () => {
  return (
    <nav>
      <ul className={styles.navList}>
        <li className={styles.navItem}>
          <Link href="/" className={styles.link}>
            Dashboard
          </Link>
        </li>
        <li className={styles.navItem}>
          <Link href="/upload" className={styles.link}>
            Carica il File
          </Link>
        </li>
        <li className={styles.navItem}>
          <Link href="/editor" className={styles.link}>
            Editor AI
          </Link>
        </li>
      </ul>
    </nav>
  );
};

export default Navigation;
