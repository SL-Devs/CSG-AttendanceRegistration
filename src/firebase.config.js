// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getDatabase } from "firebase/database";
import { getStorage } from "firebase/storage";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCuhKZnbFdVOrnrRNyOPLmJ8KsISrpIlic",
  authDomain: "csg-attendance.firebaseapp.com",
  databaseURL: "https://csg-attendance-default-rtdb.firebaseio.com",
  projectId: "csg-attendance",
  storageBucket: "csg-attendance.appspot.com",
  messagingSenderId: "913037396545",
  appId: "1:913037396545:web:facc1bfdf096a893f7d4c0",
  measurementId: "G-051FYBCNKE",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getDatabase(app);
export const auth = getAuth(app);
export const storage = getStorage(app);
