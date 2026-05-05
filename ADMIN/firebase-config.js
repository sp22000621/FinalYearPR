// firebase-config.js – same project as your main app
const firebaseConfig = {
  apiKey: "AIzaSyCN56TY6ndgVZpJlADNaNqqG6luJZb6xx0",
  authDomain: "student-reporting-platform.firebaseapp.com",
  projectId: "student-reporting-platform",
  storageBucket: "student-reporting-platform.appspot.com",
  messagingSenderId: "775304519881",
  appId: "1:775304519881:web:4277530d1d938a5105ed18"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);

// Firestore instance
const db = firebase.firestore();