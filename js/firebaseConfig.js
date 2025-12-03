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
const app = firebase.initializeApp(firebaseConfig);

// تعريف المتغيرات العالمية (لتسهيل الوصول إليها من الملفات الأخرى)
window.auth = firebase.auth();
window.onAuthStateChanged = firebase.auth().onAuthStateChanged.bind(firebase.auth());
window.signInWithEmailAndPassword = firebase.auth().signInWithEmailAndPassword.bind(firebase.auth());
window.signOut = firebase.auth().signOut.bind(firebase.auth());
// يمكننا هنا مستقبلاً إضافة window.db = firebase.firestore();
