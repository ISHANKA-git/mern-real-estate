// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "mern-real-estate-62be2.firebaseapp.com",
  projectId: "mern-real-estate-62be2",
  storageBucket: "mern-real-estate-62be2.appspot.com",
  messagingSenderId: "1058537542376",
  appId: "1:1058537542376:web:47c30dc2cdd6780035af5d"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);