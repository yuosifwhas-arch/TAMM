// js/auth.js

import { auth } from "./firebaseConfig.js";
import { signInWithEmailAndPassword, signOut } from "https://www.gstatic.com/firebase/9/firebase-auth.js";

// تم حذف import { navigateTo } من هنا لحل مشكلة التعارض

// دالة التعامل مع تسجيل الدخول
export async function handleLogin(email, password) {
    const errorMessageElement = document.getElementById('error-message');
    // التأكد من وجود العنصر لتجنب الأخطاء
    if (errorMessageElement) {
        errorMessageElement.textContent = ''; 
        errorMessageElement.style.display = 'none';
    }

    try {
        // محاولة تسجيل الدخول
        await signInWithEmailAndPassword(auth, email, password);
        // لا نحتاج لاستدعاء navigateTo هنا، لأن onAuthStateChanged في app.js ستقوم بذلك تلقائياً

    } catch (error) {
        console.error("خطأ في تسجيل الدخول:", error.message);

        let message = "حدث خطأ غير معروف في تسجيل الدخول.";
        if (error.code === 'auth/user-not-found' || error.code === 'auth/wrong-password') {
            message = "البريد الإلكتروني أو كلمة المرور غير صحيحة.";
        } else if (error.code === 'auth/invalid-email') {
            message = "صيغة البريد الإلكتروني غير صحيحة.";
        } else if (error.code === 'auth/too-many-requests') {
             message = "تم حظر هذا الحساب مؤقتاً. الرجاء المحاولة لاحقاً.";
        }

        if (errorMessageElement) {
            errorMessageElement.textContent = `فشل الدخول: ${message}`;
            errorMessageElement.style.display = 'block';
        }
    }
}

// دالة تسجيل الخروج
export async function logoutUser() {
    try {
        await signOut(auth);
        // التنقل سيحدث تلقائياً عبر app.js
    } catch (error) {
        console.error("خطأ في تسجيل الخروج:", error.message);
        alert("فشل تسجيل الخروج. يرجى المحاولة مرة أخرى.");
    }
}
