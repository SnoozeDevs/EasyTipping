// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBiMoi3OMazFt3T6XSqwUoVnZconchhysg",
  authDomain: "easytipping-a7ad3.firebaseapp.com",
  databaseURL:
    "https://easytipping-a7ad3-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "easytipping-a7ad3",
  storageBucket: "easytipping-a7ad3.appspot.com",
  messagingSenderId: "922171320829",
  appId: "1:922171320829:web:4fab09f9dcf8c308b05194",
  measurementId: "G-172F8K2ZLX",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
