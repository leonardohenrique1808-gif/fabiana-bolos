// src/utils/firebase.js
import { initializeApp } from "firebase/app";
import { getFirestore }  from "firebase/firestore";

const firebaseConfig = {
  apiKey:            "AIzaSyCm0UriVzi3_tAp-PHwEZdACj2uv43DRI8",
  authDomain:        "fabiana-bolos.firebaseapp.com",
  projectId:         "fabiana-bolos",
  storageBucket:     "fabiana-bolos.firebasestorage.app",
  messagingSenderId: "562024231352",
  appId:             "1:562024231352:web:b3dc193d570aa12c129f4d",
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
