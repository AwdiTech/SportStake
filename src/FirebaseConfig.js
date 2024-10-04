// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getDatabase } from "firebase/database";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBcH0-nuwMlfPDhrf7U2zpj2pk0ONDzkv8",
  authDomain: "sportstake-a0583.firebaseapp.com",
  databaseURL: "https://sportstake-a0583-default-rtdb.firebaseio.com",
  projectId: "sportstake-a0583",
  storageBucket: "sportstake-a0583.appspot.com",
  messagingSenderId: "151341216393",
  appId: "1:151341216393:web:c9aff397f0917e7d1a8c58",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Authentication and get a reference to the service
export const auth = getAuth(app);
export const db = getDatabase(app);

export const firestore = getFirestore(app);
export default app;
