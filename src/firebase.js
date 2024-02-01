// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth"
import { getFirestore } from "firebase/firestore"
import { getStorage } from "firebase/storage"
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyAzfy44HUGB-VR30cd8W3vJ7TLwAXp_fxI",
    authDomain: "azman-a1a36.firebaseapp.com",
    projectId: "azman-a1a36",
    storageBucket: "azman-a1a36.appspot.com",
    messagingSenderId: "677019468720",
    appId: "1:677019468720:web:cad3fc2bd00859502d4c75"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app)
export const db = getFirestore(app)
export const storage = getStorage(app)