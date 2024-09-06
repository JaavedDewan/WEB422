
// firebase.js
import { initializeApp } from "firebase/app";
import { getStorage } from "firebase/storage";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyDvFVmAo0Uh87w5m6X3LWdd8Q5U-3KWda8",
  authDomain: "authentication-233c0.firebaseapp.com",
  projectId: "authentication-233c0",
  storageBucket: "authentication-233c0.appspot.com",
  messagingSenderId: "1006039767993",
  appId: "1:1006039767993:web:85970e2610a1d118917468",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Storage
const storage = getStorage(app);

// Initialize Firestore
const db = getFirestore(app);

// Initialize Firebase Auth
const auth = getAuth(app);

export { storage, db, auth };

