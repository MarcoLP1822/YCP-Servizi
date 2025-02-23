/**
 * @fileoverview
 * This component manages the side navigation of the application.
 * It includes links to key pages such as Dashboard, File Upload, and AI Editor.
 * 
 * Key features:
 * - Provides client-side navigation using Next.js Link.
 * - The visual layout is responsive and adjusts via CSS (Navigation.module.css).
 * 
 * @notes
 * - No code changes were needed in this file as responsiveness is handled by the CSS.
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
