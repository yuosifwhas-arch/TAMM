// js/firebaseConfig.js

// استخدام روابط CDN ليعمل المتصفح بدون مشاكل
import { initializeApp } from "https://www.gstatic.com/firebase/9/firebase-app.js";
import { getAuth, onAuthStateChanged } from "https://www.gstatic.com/firebase/9/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebase/9/firebase-firestore.js";

// إعدادات مشروعك (هذه صحيحة بناءً على ما أرسلته سابقاً)
const firebaseConfig = {
  apiKey: "AIzaSyCIjIjs-2nhLrtssISWc0pNuX2UzxhQ3ZE",
  authDomain: "shipping-tracker-pro.firebaseapp.com",
  projectId: "shipping-tracker-pro",
  storageBucket: "shipping-tracker-pro.firebasestorage.app",
  messagingSenderId: "188119609466",
  appId: "1:188119609466:web:2f2498def75deb9905cbc3",
  measurementId: "G-6V51EXWFMJ"
};

// تهيئة التطبيق
const app = initializeApp(firebaseConfig);

// تصدير الخدمات
export const auth = getAuth(app);
export const db = getFirestore(app);
export { onAuthStateChanged };
