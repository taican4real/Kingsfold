import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import App from './App.tsx';
import './index.css';

import { HelmetProvider } from 'react-helmet-async';

// Unregister any active service workers to resolve API/cookie conflicts in the sandbox environment
if (typeof window !== 'undefined' && 'serviceWorker' in navigator) {
  navigator.serviceWorker.getRegistrations().then((registrations) => {
    for (const registration of registrations) {
      registration.unregister().then((success) => {
        if (success) console.log('[Service Worker] Unregistered stale SW successfully.');
      });
    }
  }).catch(err => console.error('[Service Worker] Error during unreg:', err));

  // Clear all caches to purge stale HTML responses for API routes
  if ('caches' in window) {
    caches.keys().then((names) => {
      for (const name of names) {
        caches.delete(name).catch(() => {});
      }
    }).catch(() => {});
  }
}

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

