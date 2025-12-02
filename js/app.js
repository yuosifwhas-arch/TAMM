// js/app.js

import { auth, onAuthStateChanged } from "./firebaseConfig.js";
import { handleLogin, logoutUser } from "./auth.js"; 
// سنقوم باستيراد وظائف إدارة البيانات من dataManager.js في الخطوة القادمة
// import { loadDashboardData } from "./dataManager.js"; 


// 1. دالة التنقل بين الواجهات (Routing)
// وظيفتها: إخفاء جميع الأقسام التي تحمل الفئة .page وإظهار القسم المحدد فقط.
export function navigateTo(pageId) {
    document.querySelectorAll('.page').forEach(page => {
        page.classList.remove('active');
        page.classList.add('hidden');
    });
    // التأكد من وجود العنصر قبل محاولة إظهاره
    const targetPage = document.getElementById(pageId);
    if (targetPage) {
        targetPage.classList.remove('hidden');
        targetPage.classList.add('active');
    }
}


// 2. وظيفة تحديث واجهة لوحة التحكم
function updateDashboardUI(user) {
    // هنا يمكننا عرض البريد الإلكتروني (أو الاسم إذا كنا نحفظه في Firestore)
    const welcomeText = document.getElementById('welcome-user-text');
    if (welcomeText && user) {
        welcomeText.textContent = `مرحباً بك، ${user.email} (UID: ${user.uid.substring(0, 6)}...)`;
    }
    
    // ** ملاحظة هامة للمرحلة القادمة: **
    // هنا سنستدعي دالة تحميل بيانات الشحنات والإحصائيات
    // if (user) {
    //     loadDashboardData(user.uid); 
    // }
}


// 3. وظيفة التهيئة الرئيسية (بعد تحميل الصفحة)
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

    // ج. ربط أزرار التنقل (لواجهات سنضيفها لاحقاً)
    // هذا مجرد نموذج، سنضيف الأزرار في index.html لاحقاً.
    document.getElementById('go-to-create-shipment')?.addEventListener('click', () => navigateTo('create-shipment-page'));
    document.getElementById('go-to-invoices')?.addEventListener('click', () => navigateTo('invoices-page'));
    document.getElementById('go-to-dashboard')?.addEventListener('click', () => navigateTo('dashboard-page'));


    // د. مراقبة حالة المستخدم (مهم جداً!)
    // تتأكد هذه الدالة من حالة المستخدم عند تحميل التطبيق أو تغيير الحالة.
    onAuthStateChanged(auth, (user) => {
        if (user) {
            // المستخدم مسجل الدخول
            console.log("المستخدم مسجل: ", user.uid);
            updateDashboardUI(user); // تحديث رسالة الترحيب
            navigateTo('dashboard-page');
        } else {
            // المستخدم غير مسجل الدخول
            console.log("المستخدم غير مسجل.");
            navigateTo('login-page');
        }
    });
});
