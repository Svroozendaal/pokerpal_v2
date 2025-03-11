import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getAnalytics } from "firebase/analytics";

const firebaseConfig = {
  apiKey: "AIzaSyDuviiD94sK5o9yHgbz-AnmjrEPy_YtAkM",
  authDomain: "pokerpal-1176a.firebaseapp.com",
  projectId: "pokerpal-1176a",
  storageBucket: "pokerpal-1176a.firebasestorage.app",
  messagingSenderId: "242856880102",
  appId: "1:242856880102:web:0aa7b0fffce7efd751d827",
  measurementId: "G-NT9PDB1NYK"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const analytics = getAnalytics(app);
export default app; 