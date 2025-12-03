// 📄 js/firebaseConfig.js
// [✅ التعديل هنا]: لم نعد نستورد الدوال من روابط CDN، بل من المكتبة نفسها التي تم تحميلها في index.html
// يجب أن نستخدم now استيراد الدوال فقط بدون رابط

import { initializeApp } from 'firebase/app';
import { getAuth, signInWithEmailAndPassword, onAuthStateChanged, signOut } from 'firebase/auth';
import { getFirestore, collection, query, where, getDocs, doc, getDoc, setDoc } from 'firebase/firestore';


// [إعدادات المشروع]
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

// رابط Apps Script API
const GOOGLE_SHEET_API_URL = "https://script.google.com/macros/s/AKfycbyJ_v-RrcD2INcC7vlhklfCd_KreglwiIIWp4cAXVmdTApe5_Mj3cP5nlCN7LOqeZTLgw/exec";


// تصدير الدوال التي تحتاجها الملفات الأخرى
export { 
    auth, 
    db, 
    GOOGLE_SHEET_API_URL, 
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
