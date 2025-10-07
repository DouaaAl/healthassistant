// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";

import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyA0nDe_ru08jmcsnHfWQkYYriHSJmArDc0",
  authDomain: "health-183a2.firebaseapp.com",
  databaseURL: "https://health-183a2-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "health-183a2",
  storageBucket: "health-183a2.firebasestorage.app",
  messagingSenderId: "125271702784",
  appId: "1:125271702784:web:12b374ae108fd5669d87e5",
  measurementId: "G-CX45MJDT2B"
};

const app = initializeApp(firebaseConfig);
export const database = getDatabase(app);