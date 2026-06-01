import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import App from './App.tsx';
import './index.css';

import { HelmetProvider } from 'react-helmet-async';
import * as serviceWorker from './registerServiceWorker';

// Suppress Firestore connection backend warnings in sandbox/offline mode
if (typeof window !== 'undefined') {
  const originalWarn = console.warn;
  const originalError = console.error;

  console.warn = function (...args: any[]) {
    const msg = args.map(arg => typeof arg === 'object' ? JSON.stringify(arg) : String(arg)).join(' ');
    if (
      msg.includes('Could not reach Cloud Firestore backend') ||
      msg.includes('client is offline') ||
      msg.includes('Failed to get document because the client is offline')
    ) {
      // Quietly consume offline warnings
      return;
    }
    originalWarn.apply(console, args);
  };

  console.error = function (...args: any[]) {
    const msg = args.map(arg => typeof arg === 'object' ? JSON.stringify(arg) : String(arg)).join(' ');
    if (
      msg.includes('Could not reach Cloud Firestore backend') ||
      msg.includes('client is offline') ||
      msg.includes('Failed to get document because the client is offline')
    ) {
      // Quietly consume offline errors
      return;
    }
    originalError.apply(console, args);
  };
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <HelmetProvider>
      <App />
    </HelmetProvider>
  </StrictMode>,
);

serviceWorker.register();

