// js/auth.js

import { auth } from "./firebaseConfig.js";
import { signInWithEmailAndPassword, signOut } from "https://www.gstatic.com/firebase/9/firebase-auth.js";
import { navigateTo } from "./app.js"; 

// دالة التعامل مع تسجيل الدخول
export async function handleLogin(email, password) {
    const errorMessageElement = document.getElementById('error-message');
    errorMessageElement.textContent = ''; // مسح الرسائل السابقة
    errorMessageElement.style.display = 'none';

    try {
        // محاولة تسجيل الدخول باستخدام Firebase
        await signInWithEmailAndPassword(auth, email, password);
        // التنقل إلى لوحة التحكم يتم تلقائياً عن طريق onAuthStateChanged في app.js

    } catch (error) {
        // التعامل مع الأخطاء وإظهارها للمستخدم
        console.error("خطأ في تسجيل الدخول:", error.message);

        let message = "حدث خطأ غير معروف في تسجيل الدخول.";
        if (error.code === 'auth/user-not-found' || error.code === 'auth/wrong-password') {
            message = "البريد الإلكتروني أو كلمة المرور غير صحيحة.";
        } else if (error.code === 'auth/invalid-email') {
            message = "صيغة البريد الإلكتروني غير صحيحة.";
        } else if (error.code === 'auth/too-many-requests') {
             message = "تم حظر هذا الحساب مؤقتاً بسبب محاولات تسجيل دخول فاشلة متكررة.";
        }

        errorMessageElement.textContent = `فشل الدخول: ${message}`;
        errorMessageElement.style.display = 'block';
    }
}

// دالة تسجيل الخروج
export async function logoutUser() {
    try {
        await signOut(auth);
        // التنقل إلى صفحة الدخول يتم تلقائياً عن طريق onAuthStateChanged في app.js
    } catch (error) {
        console.error("خطأ في تسجيل الخروج:", error.message);
        alert("فشل تسجيل الخروج. يرجى المحاولة مرة أخرى.");
    }
}
