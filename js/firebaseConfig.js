// [تعديل]: الآن نستخدم دوال import/export
import { initializeApp } from 'https://www.gstatic.com/firebasejs/9/firebase-app.js';
import { getAuth, signInWithEmailAndPassword, onAuthStateChanged, signOut } from 'https://www.gstatic.com/firebasejs/9/firebase-auth.js';
import { getFirestore, collection, query, where, getDocs, doc, getDoc, orderBy } from 'https://www.gstatic.com/firebasejs/9/firebase-firestore.js';


// بيانات إعداد مشروعك
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

// تعريف المتغيرات المحلية (ES Modules)
const auth = getAuth(app);
const db = getFirestore(app);

// تصدير الدوال التي تحتاجها الملفات الأخرى (مثل app.js)
export { 
    auth, 
    db, 
    signInWithEmailAndPassword, 
    onAuthStateChanged, 
    signOut,
    collection,
    query,
    where,
    getDocs,
    doc,
    getDoc,
    orderBy
};
