// js/auth.js (التحويل لاستخدام المتغيرات العالمية)

// تم حذف عبارات import لأن الخدمات أصبحت متاحة عالمياً عبر وسم <script> في index.html

// دالة التعامل مع تسجيل الدخول
export async function handleLogin(email, password) {
    // نستخدم window.auth و window.firebase الدوال التي سيتم تحميلها عالمياً
    const authService = window.auth; 
    const signInWithEmailAndPassword = window.firebase.signInWithEmailAndPassword;

    const errorMessageElement = document.getElementById('error-message');
    // التأكد من وجود العنصر لتجنب الأخطاء
    if (errorMessageElement) {
        errorMessageElement.textContent = ''; 
        errorMessageElement.style.display = 'none';
    }

    try {
        // محاولة تسجيل الدخول
        await signInWithEmailAndPassword(authService, email, password);

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
    const authService = window.auth;
    const signOut = window.firebase.signOut;
    
    try {
        await signOut(authService);
        // التنقل سيحدث تلقائياً عبر app.js
    } catch (error) {
        console.error("خطأ في تسجيل الخروج:", error.message);
        alert("فشل تسجيل الخروج. يرجى المحاولة مرة أخرى.");
    }
}
