/**
 * @fileoverview
 * Questa pagina rappresenta il Dashboard principale dell'applicazione.
 * Utilizza il componente Layout per fornire una struttura coerente.
 * 
 * Key features:
 * - Messaggio di benvenuto.
 * - Breve descrizione delle funzionalità.
 * 
 * @dependencies
 * - React: per la gestione dei componenti.
 * - components/Layout.tsx: per il layout dell'applicazione.
 * 
 * @notes
 * - La pagina è in italiano e segue le linee guida del Material Design.
 */

import React from 'react';
import Layout from '../components/Layout';

const Dashboard: React.FC = () => {
  return (
    <Layout>
      <h2>Benvenuto in YCP Servizi</h2>
      <p>
        Questa piattaforma ti permette di caricare file di libri (DOCX o PDF) e ottenere contenuti generati da AI per migliorare la presentazione e la commercializzazione del tuo libro.
      </p>
    </Layout>
  );
};

export default Dashboard;
