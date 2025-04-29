import  { initializeApp } from 'firebase/app';
import 'firebase/database';
import { getDatabase } from 'firebase/database';

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  databaseURL: "https://health-183a2-default-rtdb.europe-west1.firebasedatabase.app/",
  measurementId: "G-CX45MJDT2B"
};

const app = initializeApp(firebaseConfig);
const database = getDatabase(app);
export {database}

  
