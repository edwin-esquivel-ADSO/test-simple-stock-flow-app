import React from 'react';
import ReactDOM from 'react-dom/client';
import './infrastructure/bootstrap.js'; // Inicializa el Composition Root e inyección de dependencias
import App from './App.jsx';
import './index.css';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
