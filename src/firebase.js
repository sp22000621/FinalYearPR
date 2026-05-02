// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";

// FIX: Added these two missing imports
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCN56TY6ndgVZpJlADNaNqqG6luJZb6xx0",
  authDomain: "student-reporting-platform.firebaseapp.com",
  projectId: "student-reporting-platform",
  storageBucket: "student-reporting-platform.firebasestorage.app",
  messagingSenderId: "775304519881",
  appId: "1:775304519881:web:4277530d1d938a5105ed18",
  measurementId: "G-F3BD8HV3ER"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

// Export these so we can use them in your Login and Dashboard pages
export const auth = getAuth(app);
export const db = getFirestore(app);