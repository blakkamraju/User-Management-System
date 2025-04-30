import { initializeApp } from 'firebase/app'
import { getFirestore, collection, addDoc, getDocs, query, where, Firestore } from 'firebase/firestore'

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBwNVISh9t3TwlFb_-VpXb20m6zEzRZbok",
  authDomain: "usermanagementsystem-b7984.firebaseapp.com",
  projectId: "usermanagementsystem-b7984",
  storageBucket: "usermanagementsystem-b7984.firebasestorage.app",
  messagingSenderId: "503413071570",
  appId: "1:503413071570:web:86a139ab6de89a7d68d70b",
  measurementId: "G-WFE04D8NKY"
};


const app = initializeApp(firebaseConfig)
const db: Firestore = getFirestore(app)

export { db, addDoc, collection, getDocs, query, where, app }


