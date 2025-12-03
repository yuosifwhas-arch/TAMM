// ** ملاحظة: هذا الملف يعتمد على تهيئة Firebase الموجودة في firebaseConfig.js **

// دالة التعامل مع تسجيل الدخول
async function handleLogin(email, password) {
    // نستخدم المتغيرات العالمية المُعرفة في firebaseConfig.js
    const signInService = window.signInWithEmailAndPassword;

    const errorMessageElement = document.getElementById('error-message');
    if (errorMessageElement) {
        errorMessageElement.textContent = ''; 
        errorMessageElement.style.display = 'none';
    }

    // التحقق الأولي: إذا كانت الحقول فارغة، أظهر رسالة وتوقف
    if (!email || !password) {
        let message = "الرجاء إدخال البريد الإلكتروني وكلمة المرور.";
        if (errorMessageElement) {
            errorMessageElement.textContent = `فشل الدخول: ${message}`;
            errorMessageElement.style.display = 'block';
        }
        return; 
    }

    try {
        // محاولة تسجيل الدخول - يتم استدعاء الدالة بصيغة V8
        await signInService(email, password); 

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
async function logoutUser() {
    const signOutService = window.signOut;
    
    try {
        await signOutService();
    } catch (error) {
        console.error("خطأ في تسجيل الخروج:", error.message);
        alert("فشل تسجيل الخروج.");
    }
}
