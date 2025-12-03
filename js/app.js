import { 
    auth, 
    db, 
    signInWithEmailAndPassword, 
    onAuthStateChanged, 
    signOut,
    collection,
    query,
    where,
    getDocs,
    doc
} from './firebaseConfig.js';

import { getShipmentDetails, createNewShipment } from './trackingApi.js';

// متغير لتخزين UID المستخدم الحالي
let currentUserId = null; 

// ==========================================
// الدوال: المصادقة
// ==========================================

async function handleLogin(email, password) {
    const errorMessage = document.getElementById('error-message');
    errorMessage.textContent = ''; 
    
    try {
        // [✅ تم التعديل]: تم إضافة 'auth' كمعامل أول
        await signInWithEmailAndPassword(auth, email, password);
    } catch (error) {
        let msg = "فشل تسجيل الدخول. تحقق من البيانات.";
        if (error.code === 'auth/invalid-credential') {
             msg = "البريد أو كلمة المرور غير صحيحة.";
        }
        errorMessage.textContent = msg;
        console.error("Firebase Auth Error:", error);
    }
}

function logoutUser() {
    // [✅ تم التعديل]: تم تمرير 'auth' لضمان عمل تسجيل الخروج
    signOut(auth);
}

// ==========================================
// الدوال: واجهة المستخدم والتنقل
// ==========================================

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

function updateShipmentsList(shipments) {
    // [ملاحظة]: هذه الدالة يجب أن تُعرض قائمة الشحنات التي تأتي من Google Sheet.
    // حالياً، سنفترض أنها تعرض قائمة بسيطة.
    const tableBody = document.getElementById('shipments-table');
    tableBody.innerHTML = `<tr><th>رقم الشحنة</th><th>الحالة</th><th>تفاصيل</th></tr>`;
    
    if (shipments.length === 0) {
        tableBody.innerHTML += `<tr><td colspan="3">لا توجد شحنات مسجلة باسمك.</td></tr>`;
        return;
    }

    shipments.forEach(shipment => {
        const row = tableBody.insertRow(-1); 
        row.innerHTML = `
            <td>${shipment.TrackingID}</td>
            <td>${shipment.Status}</td>
            <td><button class="details-btn" data-tracking-code="${shipment.TrackingID}">عرض</button></td>
        `;
    });
}


// ==========================================
// الدوال: جلب البيانات من Google Sheets
// ==========================================

// [مؤقت] هذه الدالة ستُعدل لاحقاً لتجلب جميع شحنات المستخدم من Google Sheet
async function loadShipments(userId) {
    // بما أن Google Sheet لا يستطيع عمل مصادقة، سنستخدم واجهة API مؤقتة
    // لجلب شحنات تجريبية للمستخدم
    
    const shipments = [
        { TrackingID: "TEST-001", Status: "قيد التوصيل" },
        { TrackingID: "TEST-002", Status: "تم التسليم" }
    ];

    updateShipmentsList(shipments);
}

// ==========================================
// الدوال: تفاصيل الشحنة
// ==========================================

async function loadShipmentDetails(trackingCode) {
    const historyList = document.getElementById('history-list');
    
    historyList.innerHTML = '<p>جاري تحميل سجل التتبع من Google Sheets...</p>';
    navigateTo('shipment-details-page');

    try {
        // [استدعاء دالة جلب البيانات من Google Sheet API]
        const data = await getShipmentDetails(trackingCode);

        // تحديث معلومات الشحنة
        document.getElementById('tracking-number-display').textContent = data.shipment.TrackingID;
        document.getElementById('details-tracking-number').textContent = data.shipment.TrackingID; 
        document.getElementById('current-status').textContent = data.shipment.Status;
        document.getElementById('owner-uid-display').textContent = data.shipment.OwnerUID; // عرض الـ UID المالك
        document.getElementById('created-at-date').textContent = data.shipment.CreatedAt;

        // تحديث سجل التتبع
        historyList.innerHTML = '';
        if (data.history && data.history.length > 0) {
            data.history.forEach(update => {
                historyList.innerHTML += `
                    <div class="timeline-item">
                        <div class="timeline-date">${update.Timestamp}</div>
                        <div class="timeline-content">
                            <h4>${update.Status}</h4>
                            <p>${update.Location}</p>
                        </div>
                    </div>
                `;
            });
        } else {
            historyList.innerHTML = '<p>لا يتوفر سجل تتبع لهذه الشحنة حالياً.</p>';
        }

    } catch (error) {
        console.error("خطأ في جلب تفاصيل الشحنة:", error);
        alert(`فشل في جلب البيانات: ${error.message}`);
        navigateTo('shipment-list-page');
    }
}


// ==========================================
// وظيفة التهيئة الرئيسية
// ==========================================

document.addEventListener('DOMContentLoaded', () => {
    
    // ربط نموذج تسجيل الدخول
    const loginForm = document.getElementById('login-form');
    if (loginForm) {
        loginForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const email = document.getElementById('email').value;
            const password = document.getElementById('password').value;
            handleLogin(email, password); 
        });
    }

    // ربط زر تسجيل الخروج
    const logoutButton = document.getElementById('logout-button');
    if (logoutButton) logoutButton.addEventListener('click', logoutUser);

    // ربط زر العودة لقائمة الشحنات
    document.getElementById('go-back-to-list').addEventListener('click', () => navigateTo('shipment-list-page'));

    // ربط حدث النقر على أزرار "عرض"
    document.getElementById('shipment-list-view').addEventListener('click', (e) => {
        if (e.target.classList.contains('details-btn')) {
            const trackingCode = e.target.getAttribute('data-tracking-code');
            loadShipmentDetails(trackingCode);
        }
    });

    // ربط زر "إنشاء شحنة جديدة" - (مؤقت لغرض الاختبار)
    document.getElementById('create-new-shipment-btn').addEventListener('click', async () => {
        if (!currentUserId) return alert("الرجاء تسجيل الدخول أولاً.");

        // [بيانات تجريبية لإنشاء شحنة]
        const newCode = `SHP-${Date.now().toString().slice(-4)}`;
        const shipmentData = {
            TrackingID: newCode,
            CustomerName: 'عميل جديد',
            Status: 'تم الإنشاء',
            CreatedAt: new Date().toISOString().slice(0, 10)
        };

        try {
            // [استدعاء دالة الكتابة إلى Google Sheets]
            const result = await createNewShipment(currentUserId, shipmentData);
            alert(`تم إنشاء الشحنة بنجاح: ${newCode}\n${result.message}`);
            // إعادة تحميل قائمة الشحنات
            loadShipments(currentUserId); 

        } catch (error) {
            alert(`فشل إنشاء الشحنة: ${error.message}`);
            console.error(error);
        }
    });


    // مراقبة حالة المستخدم (الخطوة الأهم)
    onAuthStateChanged(auth, (user) => {
        if (user) {
            console.log("المستخدم مسجل الدخول:", user.uid);
            currentUserId = user.uid; // تخزين UID
            document.getElementById('welcome-user-text').textContent = `شحناتك، مرحباً ${user.email}`;
            navigateTo('shipment-list-page');
            
            // استدعاء دالة جلب الشحنات 
            loadShipments(user.uid); 

        } else {
            console.log("المستخدم غير مسجل.");
            currentUserId = null;
            navigateTo('login-page');
        }
    });
});
