// src/firebase/firebase.js
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth"; // Import Firebase Auth
import { getFirestore } from "firebase/firestore"; // Import Firestore

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDln5fK04GzJ4u4Wt5DZB8Tkxzcal4cys8",
  authDomain: "bidnthrift-bb09e.firebaseapp.com",
  projectId: "bidnthrift-bb09e",
  storageBucket: "bidnthrift-bb09e.firebasestorage.app",
  messagingSenderId: "120667457422",
  appId: "1:120667457422:web:f80b6d5336a109658d86df",
  measurementId: "G-HG2X2PB85S"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase services
const analytics = getAnalytics(app); // For analytics (optional)
const auth = getAuth(app); // For authentication
const db = getFirestore(app); // For Firestore

// Export the Firebase services
export { auth, db, analytics };
