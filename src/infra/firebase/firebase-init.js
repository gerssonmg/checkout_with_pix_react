// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyC6RO-LQ6AkHGYg5M6XDiHADqGkXkfRNFw",
  authDomain: "expomontes2022.firebaseapp.com",
  databaseURL: "https://expomontes2022-default-rtdb.firebaseio.com",
  projectId: "expomontes2022",
  storageBucket: "expomontes2022.appspot.com",
  messagingSenderId: "827957059820",
  appId: "1:827957059820:web:e1dcffd21021cd1942c5c9",
  measurementId: "G-9ZD91VJWPD"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
// eslint-disable-next-line no-unused-vars
const analytics = getAnalytics(app);