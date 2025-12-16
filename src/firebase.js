import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyC-KFblAX-9p21WJpkVMAnGLGcvxRrjEXY",
  authDomain: "iot-project-b5299.firebaseapp.com",
  projectId: "iot-project-b5299",
  storageBucket: "iot-project-b5299.firebasestorage.app",
  messagingSenderId: "457400027952",
  appId: "1:457400027952:web:4ca9056da24f02392c56f5",
  measurementId: "G-R5S2WKB7J4",
};
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
