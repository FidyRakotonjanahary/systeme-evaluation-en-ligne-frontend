import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './assets/styles/index.css'
import { AuthProvider } from './contexts/AuthContext'; // Importez le AuthProvider

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <AuthProvider> {/* Enveloppez votre application avec AuthProvider */}
      <App />
    </AuthProvider>
  </React.StrictMode>
);
