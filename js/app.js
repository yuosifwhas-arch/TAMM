// [تعديل]: الآن نستورد الدوال من ملف التهيئة (firebaseConfig.js)
import { 
    auth, 
    db, 
    signInWithEmailAndPassword, 
    onAuthStateChanged, 
    signOut,
    query,
    where,
    getDocs,
    doc,
    getDoc,
    orderBy
} from './firebaseConfig.js';


// ==========================================
// الدوال: المصادقة (تم دمجها من auth.js)
// ==========================================

async function handleLogin(email, password) {
    const errorMessage = document.getElementById('error-message');
    errorMessage.textContent = ''; // مسح الأخطاء السابقة
    
    try {
        await signInWithEmailAndPassword(auth, email, password);
        // المصادقة الناجحة ستتم معالجتها بواسطة onAuthStateChanged
    } catch (error) {
        console.error("خطأ في تسجيل الدخول:", error.code);
        let msg = "فشل تسجيل الدخول. الرجاء التحقق من البريد أو كلمة المرور.";
        if (error.code === 'auth/user-not-found') {
             msg = "المستخدم غير موجود.";
        } else if (error.code === 'auth/wrong-password') {
             msg = "كلمة المرور غير صحيحة.";
        }
        errorMessage.textContent = msg;
    }
}

function logoutUser() {
    signOut(auth).then(() => {
        // تم تسجيل الخروج بنجاح
    }).catch((error) => {
        console.error("خطأ في تسجيل الخروج:", error);
    });
}


// ==========================================
// الدوال: واجهة المستخدم والتنقل
// ==========================================

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
            // [تعديل]: التعامل مع كائن Date
            if (shipment.createdAt instanceof Date) {
               formattedDate = shipment.createdAt.toLocaleDateString('ar-EG');
            } else if (typeof shipment.createdAt.toDate === 'function') {
               formattedDate = shipment.createdAt.toDate().toLocaleDateString('ar-EG');
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
    try {
        // الاستعلام عن الشحنات التي تعود للمستخدم الحالي
        const shipmentsCollection = collection(db, 'shipments');
        const q = query(shipmentsCollection, where('customerUid', '==', userId));
        const snapshot = await getDocs(q);

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
// الدوال: تفاصيل وسجل التتبع
// ==========================================

async function loadShipmentDetails(shipmentId) {
    const historyList = document.getElementById('history-list');
    
    // إظهار شاشة التحميل
    historyList.innerHTML = '<p>جاري تحميل سجل التتبع...</p>';
    navigateTo('shipment-details-page');

    try {
        // 1. جلب بيانات الشحنة الأساسية
        const shipmentRef = doc(db, 'shipments', shipmentId);
        const shipmentDoc = await getDoc(shipmentRef);
        
        if (!shipmentDoc.exists()) {
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
        const trackingCollection = collection(db, 'trackingUpdates');
        const updatesQuery = query(
            trackingCollection,
            where('shipmentId', '==', shipmentId),
            orderBy('timestamp', 'desc') // ترتيب من الأحدث للأقدم
        );

        const updatesSnapshot = await getDocs(updatesQuery);

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
        // ملاحظة: رسالة الخطأ هنا تعكس فشل المصادقة بسبب مشاكل التحميل السابقة.
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

    // ربط العودة للوحة التحكم من صفحة الإنشاء (والتفاصيل)
    document.querySelectorAll('#go-back-to-dashboard, #go-to-dashboard').forEach(btn => {
        if (btn) btn.addEventListener('click', () => navigateTo('dashboard-page'));
    });

    // ** ربط حدث النقر على أزرار "عرض" (Delegation) **
    document.getElementById('shipment-list').addEventListener('click', (e) => {
        if (e.target.classList.contains('details-btn')) {
            const shipmentId = e.target.getAttribute('data-shipment-id');
            loadShipmentDetails(shipmentId);
        }
    });

    // مراقبة حالة المستخدم (الخطوة الأهم)
    onAuthStateChanged(auth, (user) => {
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
