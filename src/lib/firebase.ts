import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { initializeFirestore, setLogLevel } from 'firebase/firestore';
import firebaseConfig from '../../firebase-applet-config.json';

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);

// Suppress Firestore's internal warnings about connection retries/offline state
setLogLevel('error');

// Use initializeFirestore with settings to bypass potential network/proxy issues
export const db = initializeFirestore(app, {
  experimentalForceLongPolling: true, // Force long polling for proxy compatibility
}, firebaseConfig.firestoreDatabaseId);

export default app;
