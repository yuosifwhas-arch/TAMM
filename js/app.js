// js/app.js
import { auth, onAuthStateChanged } from "./firebaseConfig.js";
import { handleLogin, logoutUser } from "./auth.js"; 

// 1. دالة التنقل بين الواجهات
// وظيفتها: إخفاء جميع الأقسام التي تحمل الفئة .page وإظهار القسم المحدد فقط.
export function navigateTo(pageId) {
    document.querySelectorAll('.page').forEach(page => {
        page.classList.remove('active');
        page.classList.add('hidden');
    });
    document.getElementById(pageId).classList.remove('hidden');
    document.getElementById(pageId).classList.add('active');
}

// 2. وظيفة التهيئة الرئيسية (بعد تحميل الصفحة)
document.addEventListener('DOMContentLoaded', () => {
    // أ. ربط زر تسجيل الدخول بوظيفة handleLogin في ملف auth.js
    const loginForm = document.getElementById('login-form');
    if (loginForm) {
        loginForm.addEventListener('submit', (e) => {
            e.preventDefault(); // منع إعادة تحميل الصفحة
            const email = document.getElementById('email').value;
            const password = document.getElementById('password').value;
            handleLogin(email, password);
        });
    }

    // ب. ربط زر تسجيل الخروج بوظيفة logoutUser في ملف auth.js
    const logoutButton = document.getElementById('logout-button');
    if (logoutButton) {
        logoutButton.addEventListener('click', logoutUser);
    }

    // ج. مراقبة حالة المستخدم (مهم جداً!)
    // هذه الدالة تتأكد من حالة المستخدم (مسجل أو غير مسجل) عند تحميل التطبيق أو تغيير الحالة.
    onAuthStateChanged(auth, (user) => {
        if (user) {
            // المستخدم مسجل الدخول
            console.log("المستخدم مسجل: ", user.uid);
            navigateTo('dashboard-page');
        } else {
            // المستخدم غير مسجل الدخول
            console.log("المستخدم غير مسجل.");
            navigateTo('login-page');
        }
    });
});
