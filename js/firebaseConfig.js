// 📄 js/firebaseConfig.js

// [✅ تم التعديل]: تم تحديث روابط الاستيراد (Import) لتشمل رقم الإصدار (9.23.0) 
// لحل مشكلة الخطأ 404 (Not Found) التي ظهرت في المتصفح.

import { initializeApp } from 'https://www.gstatic.com/firebasejs/9.23.0/firebase-app.js';
import { getAuth, signInWithEmailAndPassword, onAuthStateChanged, signOut } from 'https://www.gstatic.com/firebasejs/9.23.0/firebase-auth.js';
import { getFirestore, collection, query, where, getDocs, doc, getDoc, setDoc } from 'https://www.gstatic.com/firebasejs/9.23.0/firebase-firestore.js';


// [✅ تم التأكيد]: هذه هي إعدادات مشروعك الحقيقية
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

// [✅ تم التعديل]: تم وضع رابط Apps Script API الذي أرسلته
const GOOGLE_SHEET_API_URL = "https://script.google.com/macros/s/AKfycbyJ_v-RrcD2INcC7vlhklfCd_KreglwiIIWp4cAXVmdTApe5_Mj3cP5nlCN7LOqeZTLgw/exec";


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
