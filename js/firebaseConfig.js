// js/firebaseConfig.js

// 1. استيراد المكتبات الضرورية من Firebase
// نستخدم الرابط المباشر للمكتبة (CDN) بدلاً من تثبيتها محلياً لتسهيل العمل على GitHub Pages
import { initializeApp } from "https://www.gstatic.com/firebase/9/firebase-app.js";
import { getAuth, onAuthStateChanged } from "https://www.gstatic.com/firebase/9/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebase/9/firebase-firestore.js";

// 2. **بيانات إعداد مشروعك - قم بتغيير هذه القيم!**
const firebaseConfig = {
  apiKey: "YOUR_API_KEY", 
  authDomain: "YOUR_AUTH_DOMAIN",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_STORAGE_BUCKET",
  messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
  appId: "YOUR_APP_ID"
};

// 3. تهيئة التطبيق
const app = initializeApp(firebaseConfig);

// 4. تصدير الخدمات التي سنستخدمها
export const auth = getAuth(app);      // خدمة المصادقة
export const db = getFirestore(app);   // خدمة قاعدة البيانات Firestore
export { onAuthStateChanged }; // تصدير دالة المراقبة لحالة المستخدم
