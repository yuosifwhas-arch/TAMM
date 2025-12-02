// js/app.js

import { auth, onAuthStateChanged } from "./firebaseConfig.js";
import { handleLogin, logoutUser } from "./auth.js"; 

// 1. دالة التنقل بين الواجهات
export function navigateTo(pageId) {
    document.querySelectorAll('.page').forEach(page => {
        page.classList.remove('active');
        page.classList.add('hidden');
    });

    const targetPage = document.getElementById(pageId);
    if (targetPage) {
        targetPage.classList.remove('hidden');
        targetPage.classList.add('active');
    }
}

// 2. وظيفة تحديث واجهة المستخدم
function updateDashboardUI(user) {
    const welcomeText = document.getElementById('welcome-user-text');
    if (welcomeText && user) {
        // التحقق من وجود user.email قبل عرضه
        const email = user.email || "مستخدم";
        welcomeText.textContent = `مرحباً بك، ${email}`;
    }
}

// 3. وظيفة التهيئة الرئيسية
document.addEventListener('DOMContentLoaded', () => {

    // أ. ربط نموذج تسجيل الدخول
    const loginForm = document.getElementById('login-form');
    if (loginForm) {
        loginForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const email = document.getElementById('email').value;
            const password = document.getElementById('password').value;
            handleLogin(email, password);
        });
    }

    // ب. ربط زر تسجيل الخروج
    const logoutButton = document.getElementById('logout-button');
    if (logoutButton) {
        logoutButton.addEventListener('click', logoutUser);
    }

    // ج. ربط أزرار التنقل (احتياطي للمستقبل)
    const createShipmentBtn = document.getElementById('go-to-create-shipment');
    if (createShipmentBtn) createShipmentBtn.addEventListener('click', () => navigateTo('create-shipment-page'));

    const invoicesBtn = document.getElementById('go-to-invoices');
    if (invoicesBtn) invoicesBtn.addEventListener('click', () => navigateTo('invoices-page'));

    const dashboardBtn = document.getElementById('go-to-dashboard');
    if (dashboardBtn) dashboardBtn.addEventListener('click', () => navigateTo('dashboard-page'));

    // د. مراقبة حالة المستخدم (المحرك الرئيسي للتطبيق)
    onAuthStateChanged(auth, (user) => {
        if (user) {
            console.log("المستخدم مسجل الدخول:", user.uid);
            updateDashboardUI(user);
            navigateTo('dashboard-page');
        } else {
            console.log("المستخدم غير مسجل.");
            navigateTo('login-page');
        }
    });
});
