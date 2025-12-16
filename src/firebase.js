import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
  authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
  storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: "457400027952",
  appId: "1:457400027952:web:4ca9056da24f02392c56f5",
  measurementId: "G-R5S2WKB7J4",
};
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
