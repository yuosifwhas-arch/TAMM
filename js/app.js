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

// ==========================================
// الدوال: جلب وعرض الشحنات
// ==========================================

function renderShipments(shipments) {
    const tableBody = document.getElementById('shipments-table');
    // مسح المحتوى الحالي
    tableBody.innerHTML = `<tr><th>رقم الشحنة</th><th>تاريخ الإنشاء</th><th>الحالة</th><th>تفاصيل</th></tr>`; 

    if (shipments.length === 0) {
        tableBody.innerHTML += `<tr><td colspan="4">لا توجد شحنات نشطة حالياً.</td></tr>`;
        return;
    }

    shipments.forEach(shipment => {
        const row = tableBody.insertRow(-1); // إضافة صف جديد
        
        // ** [تعديل هنا] التعامل مع حقل Timestamp من Firestore **
        let formattedDate = 'غير متوفر';
        if (shipment.createdAt) {
             if (typeof shipment.createdAt.toDate === 'function') {
                 // الخيار الأفضل: إذا كان كائن Timestamp من Firebase V8
                 formattedDate = shipment.createdAt.toDate().toLocaleDateString('ar-EG');
             } else {
                 // الخيار الاحتياطي: إذا تم تحويله إلى كائن تاريخ عادي أو نص
                 formattedDate = new Date(shipment.createdAt).toLocaleDateString('ar-EG');
             }
        }

        row.innerHTML = `
            <td>${shipment.id}</td>
            <td>${formattedDate}</td>
            <td>${shipment.status}</td>
            <td><button class="details-btn" data-shipment-id="${shipment.id}">عرض</button></td>
        `;
    });
}


async function loadShipments(userId) {
    const db = window.db;

    try {
        // الاستعلام عن الشحنات التي تعود للمستخدم الحالي
        // (يجب أن يكون لديك مجموعة 'shipments' وحقل 'customerUid' مطابق لـ userId)
        const snapshot = await db.collection('shipments')
            .where('customerUid', '==', userId)
            .get();

        const shipments = [];
        snapshot.forEach(doc => {
            // استخدام doc.id كرقم للشحنة
            shipments.push({
                id: doc.id,
                ...doc.data()
            });
        });

        renderShipments(shipments);

    } catch (error) {
        console.error("خطأ في جلب بيانات الشحنات:", error);
        const tableBody = document.getElementById('shipments-table');
        tableBody.innerHTML = `<tr><td colspan="4">فشل في تحميل البيانات. (الرجاء التحقق من قواعد الأمان)</td></tr>`;
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

    // مراقبة حالة المستخدم (الخطوة الأهم)
    const authStateChanged = window.onAuthStateChanged;

    authStateChanged((user) => {
        if (user) {
            console.log("المستخدم مسجل الدخول:", user.uid);
            updateDashboardUI(user);
            navigateTo('dashboard-page');
            
            // استدعاء دالة جلب الشحنات 
            loadShipments(user.uid); 

        } else {
            console.log("المستخدم غير مسجل.");
            navigateTo('login-page');
        }
    });
});
