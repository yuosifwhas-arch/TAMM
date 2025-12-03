import { GOOGLE_SHEET_API_URL } from './firebaseConfig.js';

/**
 * دالة القراءة: تجلب سجل التتبع لشحنة معينة.
 * @param {string} trackingCode - رمز التتبع المطلوب.
 * @returns {Promise<Object>} - بيانات الشحنة وسجل التتبع.
 */
export async function getShipmentDetails(trackingCode) {
    if (!GOOGLE_SHEET_API_URL || GOOGLE_SHEET_API_URL.includes("PUT_YOUR")) {
        throw new Error("لم يتم تهيئة رابط Google Apps Script API بشكل صحيح.");
    }
    
    // إرسال طلب GET للحصول على تفاصيل الشحنة
    const url = `${GOOGLE_SHEET_API_URL}?action=getTracking&trackingCode=${trackingCode}`;
    
    const response = await fetch(url);
    const data = await response.json();
    
    if (data.error) {
        throw new Error(data.error);
    }
    
    return data;
}

/**
 * دالة الكتابة: تسمح للمستخدم بإنشاء شحنة جديدة (عبر إضافة سطر لـ Google Sheet).
 * @param {string} userId - UID المستخدم الذي ينشئ الشحنة (لأغراض الملكية).
 * @param {Object} shipmentData - بيانات الشحنة الأساسية (الاسم، رمز التتبع، إلخ).
 * @returns {Promise<Object>} - رسالة نجاح.
 */
export async function createNewShipment(userId, shipmentData) {
    if (!GOOGLE_SHEET_API_URL || GOOGLE_SHEET_API_URL.includes("PUT_YOUR")) {
        throw new Error("لم يتم تهيئة رابط Google Apps Script API بشكل صحيح.");
    }

    const payload = {
        action: 'createShipment',
        userId: userId,
        shipment: shipmentData
    };
    
    // إرسال طلب POST لكتابة البيانات في Google Sheet
    const response = await fetch(GOOGLE_SHEET_API_URL, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
        // [هام]: يجب السماح بـ CORS عند استخدام Apps Script
        mode: 'cors' 
    });

    const data = await response.json();
    
    if (data.error) {
        throw new Error(data.error);
    }
    
    return data;
}
