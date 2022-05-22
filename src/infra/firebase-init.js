// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyD37S7biVjxgWaxM29rme81rtqjRflaLZo",
  authDomain: "checkoutmercadopagopixwebhook.firebaseapp.com",
  databaseURL: "https://checkoutmercadopagopixwebhook-default-rtdb.firebaseio.com",
  projectId: "checkoutmercadopagopixwebhook",
  storageBucket: "checkoutmercadopagopixwebhook.appspot.com",
  messagingSenderId: "244677114830",
  appId: "1:244677114830:web:14552f5a00e78ffb07c99f",
  measurementId: "G-RP38TWGDJH"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);