// js/app.js (التحويل لاستخدام المتغيرات العالمية)

// تم حذف عبارات import لأن الخدمات (auth, onAuthStateChanged)
// أصبحت متاحة عالمياً عبر وسم <script type="module"> في index.html

// الدوال handleLogin و logoutUser متاحة عالمياً من auth.js
    
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

// 2. وظيفة تحديث واجهة المستخدم (عرض البريد الإلكتروني)
function updateDashboardUI(user) {
    const welcomeText = document.getElementById('welcome-user-text');
    if (welcomeText && user) {
        const email = user.email || "مستخدم";
        welcomeText.textContent = `مرحباً بك، ${email}`;
    }
}

// 3. وظيفة التهيئة الرئيسية
document.addEventListener('DOMContentLoaded', () => {
    
    // **فحص التحميل:** هذا التنبيه يجب أن يظهر فوراً الآن!
    alert("🟢 يجب أن يعمل الآن! تم تحميل app.js.");
    
    // أ. ربط زر تسجيل الدخول (نستخدم حدث النقر `click`)
    const loginButton = document.getElementById('login-button');

    if (loginButton) {
        loginButton.addEventListener('click', () => {
            
            // تنبيه ثانٍ للتأكد من وصول الكود إلى هنا
            alert("✅ تم التقاط ضغطة زر الدخول... جاري المحاولة."); 
            
            const email = document.getElementById('email').value;
            const password = document.getElementById('password').value;
            
            // استدعاء دالة المصادقة (متاحة عالمياً)
            handleLogin(email, password);
        });
    }

    // ب. ربط زر تسجيل الخروج
    const logoutButton = document.getElementById('logout-button');
    if (logoutButton) {
        logoutButton.addEventListener('click', logoutUser);
    }

    // ج. ربط أزرار التنقل (لواجهات مستقبلية)
    const createShipmentBtn = document.getElementById('go-to-create-shipment');
    if (createShipmentBtn) createShipmentBtn.addEventListener('click', () => navigateTo('create-shipment-page'));

    const invoicesBtn = document.getElementById('go-to-invoices');
    if (invoicesBtn) invoicesBtn.addEventListener('click', () => navigateTo('invoices-page'));

    const dashboardBtn = document.getElementById('go-to-dashboard');
    if (dashboardBtn) dashboardBtn.addEventListener('click', () => navigateTo('dashboard-page'));

    // د. مراقبة حالة المستخدم (نستخدم window.auth و window.onAuthStateChanged)
    const authService = window.auth;
    const authStateChanged = window.onAuthStateChanged;

    authStateChanged(authService, (user) => {
        if (user) {
            // alert("تم تسجيل الدخول بنجاح! الانتقال للوحة التحكم");
            console.log("المستخدم مسجل الدخول:", user.uid);
            updateDashboardUI(user);
            navigateTo('dashboard-page');
        } else {
            console.log("المستخدم غير مسجل.");
            navigateTo('login-page');
        }
    });
});
