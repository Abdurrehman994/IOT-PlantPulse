import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
  authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
  storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: "908943719282",
  appId: "1:908943719282:web:98ea5269a67993c35bbbeb",
  measurementId: "G-0HR19XLK9R",
};
// const firebaseConfig = {
//   apiKey: "AIzaSyADfby2eL4d-KJBwPb0k7XsDidEJOCpYPI",
//   authDomain: "plantpulse-iot.firebaseapp.com",
//   projectId: "plantpulse-iot",
//   storageBucket: "plantpulse-iot.firebasestorage.app",
//   messagingSenderId: "908943719282",
//   appId: "1:908943719282:web:98ea5269a67993c35bbbeb",
//   measurementId: "G-0HR19XLK9R",
// };
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
