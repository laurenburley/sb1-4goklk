import { initializeApp, type FirebaseApp } from 'firebase/app';
import { getAuth, type Auth } from 'firebase/auth';
import { getDatabase, type Database } from 'firebase/database';

const firebaseConfig = {
  apiKey: "AIzaSyDSt6B0ROQyhWpH1FXunJO1KZ8UaeVM3pY",
  authDomain: "distillery-managment.firebaseapp.com",
  projectId: "distillery-managment",
  storageBucket: "distillery-managment.appspot.com",
  messagingSenderId: "48598051126",
  appId: "1:48598051126:web:8435a0e632b18f0641ab97",
  databaseURL: "https://distillery-managment-default-rtdb.firebaseio.com"
};

// Initialize Firebase only if it hasn't been initialized yet
let app: FirebaseApp;
try {
  app = initializeApp(firebaseConfig);
} catch (error) {
  const err = error as Error;
  if (err.message?.includes('Firebase App named')) {
    app = initializeApp(firebaseConfig, 'distillery-manager');
  } else {
    throw error;
  }
}

// Get Auth instance
export const auth: Auth = getAuth(app);

// Get Realtime Database instance
export const db: Database = getDatabase(app);

// Export the app instance
export { app };