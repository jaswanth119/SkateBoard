import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { Analytics, getAnalytics } from 'firebase/analytics';

const firebaseConfig = {
  apiKey: "AIzaSyA2NEOGMvCSqZa6aYsjHppBLtkhf5Vsplo",
  authDomain: "skate-board-92949.firebaseapp.com",
  projectId: "skate-board-92949",
  storageBucket: "skate-board-92949.firebasestorage.app",
  messagingSenderId: "436645874577",
  appId: "1:436645874577:web:8cadaf10680ac53e57e830",
  measurementId: "G-K9YG3BFLN5"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Analytics only on the client side
let analytics: Analytics | null = null;
if (typeof window !== 'undefined') {
  analytics = getAnalytics(app);
}

// Initialize Firestore
export const db = getFirestore(app);
export { analytics };
