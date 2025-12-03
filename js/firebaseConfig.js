// [هام]: يجب استيراد الدوال من روابط Firebase v9 CDN
import { initializeApp } from 'https://www.gstatic.com/firebasejs/9/firebase-app.js';
import { getAuth, signInWithEmailAndPassword, onAuthStateChanged, signOut } from 'https://www.gstatic.com/firebasejs/9/firebase-auth.js';
import { getFirestore, collection, query, where, getDocs, doc, getDoc, setDoc } from 'https://www.gstatic.com/firebasejs/9/firebase-firestore.js';


// [استبدل هذه الإعدادات بمعلومات مشروعك الحقيقية]
const firebaseConfig = {
    apiKey: "AIzaSyCIjIjs-2nhLrtssISWc0pNuX2UzxhQ3ZE",
    authDomain: "shipping-tracker-pro.firebaseapp.com",
    projectId: "shipping-tracker-pro",
    storageBucket: "shipping-tracker-pro.firebasestorage.app",
    messagingSenderId: "188119609466",
    appId: "1:188119609466:web:2f2498def75deb9905cbc3",
};

// تهيئة التطبيق
const app = initializeApp(firebaseConfig);

// تعريف المتغيرات المحلية (ES Modules)
const auth = getAuth(app);
const db = getFirestore(app);

// [تعديل]: هنا يجب أن تضع الرابط الذي ستحصل عليه من نشر Apps Script
// هذا الرابط هو الجسر بين تطبيقك و Google Sheets.
// ستحصل على هذا الرابط في الخطوة 5.
const GOOGLE_SHEET_API_URL = "PUT_YOUR_PUBLISHED_APPS_SCRIPT_URL_HERE";


// تصدير الدوال التي تحتاجها الملفات الأخرى
export { 
    auth, 
    db, 
    GOOGLE_SHEET_API_URL, // تصدير الرابط
    signInWithEmailAndPassword, 
    onAuthStateChanged, 
    signOut,
    collection,
    query,
    where,
    getDocs,
    doc,
    getDoc,
    setDoc
};
