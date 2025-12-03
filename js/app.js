// ** ملاحظة: هذا الملف يعتمد على دوال المصادقة في auth.js **

// دالة التنقل بين الواجهات
function navigateTo(pageId) {
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

// وظيفة تحديث واجهة المستخدم
function updateDashboardUI(user) {
    const welcomeText = document.getElementById('welcome-user-text');
    if (welcomeText && user) {
        const email = user.email || "مستخدم";
        welcomeText.textContent = `مرحباً بك، ${email}`;
    }
}

// وظيفة التهيئة الرئيسية
document.addEventListener('DOMContentLoaded', () => {
    
    // ربط زر تسجيل الدخول
    const loginButton = document.getElementById('login-button');
    if (loginButton) {
        loginButton.addEventListener('click', () => {
            const email = document.getElementById('email').value;
            const password = document.getElementById('password').value;
            handleLogin(email, password); 
        });
    }

    // ربط زر تسجيل الخروج
    const logoutButton = document.getElementById('logout-button');
    if (logoutButton) {
        logoutButton.addEventListener('click', logoutUser);
    }

    // ربط أزرار التنقل
    const createShipmentBtn = document.getElementById('go-to-create-shipment');
    if (createShipmentBtn) createShipmentBtn.addEventListener('click', () => navigateTo('create-shipment-page'));

    const dashboardBtn = document.getElementById('go-to-dashboard');
    if (dashboardBtn) dashboardBtn.addEventListener('click', () => navigateTo('dashboard-page'));

    // مراقبة حالة المستخدم (باستخدام الدالة العالمية من firebaseConfig.js)
    const authStateChanged = window.onAuthStateChanged;

    authStateChanged((user) => {
        if (user) {
            console.log("المستخدم مسجل الدخول:", user.uid);
            updateDashboardUI(user);
            navigateTo('dashboard-page');
            // هنا مستقبلاً: استدعاء دالة loadShipments(user.uid)
        } else {
            console.log("المستخدم غير مسجل.");
            navigateTo('login-page');
        }
    });
});
