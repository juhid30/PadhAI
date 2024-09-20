// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import { getDatabase } from "firebase/database";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyB5o3k9V8VTNoq5dGQ620bWr-kOaAavXd0",
  authDomain: "hackcelestial-2024.firebaseapp.com",
  projectId: "hackcelestial-2024",
  storageBucket: "hackcelestial-2024.appspot.com",
  messagingSenderId: "196520314063",
  appId: "1:196520314063:web:aa994b521865beefcce3ba",
  measurementId: "G-TZDDW2ERCC",
  databaseURL: "https://hackcelestial-2024-default-rtdb.firebaseio.com",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firestore and Storage
const db = getFirestore(app);
const storage = getStorage(app);
const realtimeDb = getDatabase(app)
export const auth = getAuth(app);
export const provider = new GoogleAuthProvider();

export { db, storage, realtimeDb };
