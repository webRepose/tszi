import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyARz3ZyNMvPm4jDluG-qvk-A_5XBKSyr3E",
  authDomain: "tszi-e1c49.firebaseapp.com",
  projectId: "tszi-e1c49",
  storageBucket: "tszi-e1c49.firebasestorage.app",
  messagingSenderId: "260408640504",
  appId: "1:260408640504:web:16c9ea55e720033f980c0d"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
