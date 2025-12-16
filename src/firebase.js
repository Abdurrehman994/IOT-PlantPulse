import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
  authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
  storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: "703160455754",
  appId: "1:703160455754:web:f82202606dab70cfa68cb3",
  measurementId: "G-63GF8NFXE6",
};
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
