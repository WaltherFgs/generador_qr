import React from 'react';
import QRGenerator from './components/QRGenerator';

function App() {
  return (
    <div className="container animate-fade-in">
      <header className="header">
        <h1 className="title">Generador QR Pro</h1>
        <p className="subtitle">Crea, personaliza y descarga códigos QR con un diseño premium al instante.</p>
      </header>
      
      <main>
        <QRGenerator />
      </main>
    </div>
  );
}

export default App;
