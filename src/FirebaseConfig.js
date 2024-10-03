// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from 'firebase/firestore';
import { getDatabase } from 'firebase/database';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "FIzaSyDRWIjkwZr_E0YgcsjIlDjFujfDMMw4k_Q",
    authDomain: "appname-f8bcd.firebaseapp.com",
    projectId: "appname-f8bcd",
    storageBucket: "appname-f8bcd.appspot.com",
    messagingSenderId: "421368408069",
    appId: "1:423368408068:web:8a4bc075b0bc56fc9ff06c"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Authentication and get a reference to the service
export const auth = getAuth(app);
export const db = getDatabase(app);
export const firestore = getFirestore(app);
export default app;