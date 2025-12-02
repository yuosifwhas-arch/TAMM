// js/firebaseConfig.js

// 1. استيراد المكتبات الضرورية من Firebase
// نستخدم الرابط المباشر للمكتبة (CDN) بدلاً من تثبيتها محلياً لتسهيل العمل على GitHub Pages
import { initializeApp } from "https://www.gstatic.com/firebase/9/firebase-app.js";
import { getAuth, onAuthStateChanged } from "https://www.gstatic.com/firebase/9/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebase/9/firebase-firestore.js";

// 2. **بيانات إعداد مشروعك - قم بتغيير هذه القيم!**
const firebaseConfig = {
  apiKey: "AIzaSyCIjIjs-2nhLrtssISWc0pNuX2UzxhQ3ZE",
  authDomain: "shipping-tracker-pro.firebaseapp.com",
  projectId: "shipping-tracker-pro",
  storageBucket: "shipping-tracker-pro.firebasestorage.app",
  messagingSenderId: "188119609466",
  appId: "1:188119609466:web:2f2498def75deb9905cbc3",
  measurementId: "G-6V51EXWFMJ"
};

// 3. تهيئة التطبيق
const app = initializeApp(firebaseConfig);

// 4. تصدير الخدمات التي سنستخدمها
export const auth = getAuth(app);      // خدمة المصادقة
export const db = getFirestore(app);   // خدمة قاعدة البيانات Firestore
export { onAuthStateChanged }; // تصدير دالة المراقبة لحالة المستخدم
