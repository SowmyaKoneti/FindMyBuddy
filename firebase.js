// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from 'firebase/firestore';

// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyC_45XgiM_cTv3XH4Dv0bQ2NADsMu_3-b4",
  authDomain: "club3-635d3.firebaseapp.com",
  projectId: "club3-635d3",
  storageBucket: "club3-635d3.appspot.com",
  messagingSenderId: "859275643862",
  appId: "1:859275643862:web:dbaf3f8b068d55cb247277"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export { db };