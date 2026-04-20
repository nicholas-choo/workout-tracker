// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { initializeFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyDbDAJ20QB30xmQN_M7Y8Rx4XmdgZOZxtM",
    authDomain: "workout-tracker-4bed0.firebaseapp.com",
    projectId: "workout-tracker-4bed0",
    storageBucket: "workout-tracker-4bed0.firebasestorage.app",
    messagingSenderId: "911236549744",
    appId: "1:911236549744:web:b43fade4e95304326278b5",
    measurementId: "G-0XQ2XNE3ZE"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = initializeFirestore(app, {}, "default");