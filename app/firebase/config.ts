import { initializeApp, getApps } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyBw1DAKBTwafNlbLpulRjc1Dzrzdwgh5wo",
  authDomain: "sirius-funding.firebaseapp.com",
  projectId: "sirius-funding",
  messagingSenderId: "350655412924",
  appId: "1:350655412924:web:540de7be6281b98bee6eb9",
  measurementId: "G-1HW0J216T5"
};

// Initialize Firebase
let firebaseApp;

if (!getApps().length) {
  firebaseApp = initializeApp(firebaseConfig);
} else {
  firebaseApp = getApps()[0];
}

// Initialize Firestore
export const db = getFirestore(firebaseApp); 