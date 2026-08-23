// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyA3dygbrXhOEjwQE1U-w2qgZ94wkxH10wk",
  authDomain: "glyph-cam-3a0f0.firebaseapp.com",
  projectId: "glyph-cam-3a0f0",
  storageBucket: "glyph-cam-3a0f0.firebasestorage.app",
  messagingSenderId: "1090333046528",
  appId: "1:1090333046528:web:c3868900affb6594f165e5"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);