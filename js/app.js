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
        
        let formattedDate = 'غير متوفر';
        if (shipment.createdAt) {
             // التحقق مما إذا كان الكائن يحتوي على دالة toDate()
             if (typeof shipment.createdAt.toDate === 'function') {
                 formattedDate = shipment.createdAt.toDate().toLocaleDateString('ar-EG');
             } else {
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


// ==========================================
// الدوال الجديدة: تفاصيل وسجل التتبع
// ==========================================

async function loadShipmentDetails(shipmentId) {
    const db = window.db;
    const historyList = document.getElementById('history-list');
    
    // إظهار شاشة التحميل
    historyList.innerHTML = '<p>جاري تحميل سجل التتبع...</p>';
    navigateTo('shipment-details-page');

    try {
        // 1. جلب بيانات الشحنة الأساسية
        const shipmentDoc = await db.collection('shipments').doc(shipmentId).get();
        
        if (!shipmentDoc.exists) {
            alert('لم يتم العثور على الشحنة.');
            navigateTo('dashboard-page');
            return;
        }

        const shipmentData = shipmentDoc.data();
        
        // تحديث الواجهة بمعلومات الشحنة
        document.getElementById('tracking-number-display').textContent = shipmentDoc.id;
        document.getElementById('details-tracking-number').textContent = shipmentDoc.id; 
        document.getElementById('current-status').textContent = shipmentData.status;
        
        let createdAtDate = 'غير متوفر';
        if (shipmentData.createdAt && typeof shipmentData.createdAt.toDate === 'function') {
            createdAtDate = shipmentData.createdAt.toDate().toLocaleDateString('ar-EG');
        }
        document.getElementById('created-at-date').textContent = createdAtDate;

        // 2. جلب سجل التتبع
        const updatesSnapshot = await db.collection('trackingUpdates')
            .where('shipmentId', '==', shipmentId)
            .orderBy('timestamp', 'desc') // ترتيب من الأحدث للأقدم
            .get();

        historyList.innerHTML = ''; // مسح رسالة التحميل

        if (updatesSnapshot.empty) {
            historyList.innerHTML = '<p>لا يتوفر سجل تتبع لهذه الشحنة حالياً.</p>';
        } else {
            updatesSnapshot.forEach(doc => {
                const update = doc.data();
                let updateTime = '';
                if (update.timestamp && typeof update.timestamp.toDate === 'function') {
                    // عرض التاريخ والوقت المحلي 
                    updateTime = update.timestamp.toDate().toLocaleString('ar-EG', { dateStyle: 'short', timeStyle: 'short' }); 
                }

                // بناء عنصر Timeline
                historyList.innerHTML += `
                    <div class="timeline-item">
                        <div class="timeline-date">${updateTime}</div>
                        <div class="timeline-content">
                            <h4>${update.status}</h4>
                            <p>${update.location}</p>
                        </div>
                    </div>
                `;
            });
        }
    } catch (error) {
        console.error("خطأ في جلب تفاصيل الشحنة:", error);
        alert('فشل في تحميل تفاصيل الشحنة. (تحقق من قواعد الأمان)');
        historyList.innerHTML = '<p>فشل في تحميل سجل التتبع.</p>';
        navigateTo('dashboard-page');
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
    // ربط العودة للوحة التحكم من صفحة الإنشاء (والتفاصيل)
    document.querySelectorAll('#go-back-to-dashboard, #go-to-dashboard').forEach(btn => {
        if (btn) btn.addEventListener('click', () => navigateTo('dashboard-page'));
    });

    // ** [جديد] ربط حدث النقر على أزرار "عرض" (Delegation) **
    // نستخدم event delegation لربط النقر على الأزرار التي يتم إنشاؤها ديناميكياً
    document.getElementById('shipment-list').addEventListener('click', (e) => {
        if (e.target.classList.contains('details-btn')) {
            const shipmentId = e.target.getAttribute('data-shipment-id');
            loadShipmentDetails(shipmentId);
        }
    });

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
