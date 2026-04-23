# ZAHA Flow Theme (Arabic RTL Bootstrap Dashboard)

قالب إداري عربي حديث مبني على **Bootstrap 5.3** مع دعم احترافي للاتجاهين **RTL / LTR** ووضعي **Light / Dark**.

## المميزات الأساسية
- Bootstrap-first layout بدون تعارض مع أطر إضافية.
- سايد بار واضح مع صفحات فعلية لكل ميزة رئيسية.
- دعم i18n (العربية / الإنجليزية) مع تحميل ملفات ترجمة JSON.
- Dark/Light mode محفوظ في LocalStorage.
- FullCalendar + Flatpickr للجدولة والتواريخ.
- Toastr + SweetAlert للإشعارات.

## هيكل الصفحات المعتمد
- `index.html` : لوحة التحكم + KPI + تقويم + وقت/تاريخ.
- `card.html` : كروت الألوان الجديدة (Gradients).
- `Chart.html` : مؤشرات وتحليلات.
- `Input.html` : نماذج الإدخال.
- `modal.html` : إشعارات (نجاح/تحذير/معلومة).
- `sidebar.html` : الإعدادات العامة.

## الملفات المهمة
- `css/Theme.css` : ألوان ومتغيرات الثيم (فاتح/داكن).
- `css/Style.css` : التخطيط والمظهر العام والسايدبار.
- `js/app.js` : إدارة اللغة، الثيم، الاتجاه، والميزات الديناميكية.
- `locales/ar/common.json` و `locales/en/common.json` : النصوص والترجمة.

## تشغيل محلي سريع
يمكن تشغيل المشروع بأي Static Server (مثل VS Code Live Server) وفتح:
`Nozha-rtl-Dashboard-master/index.html`

## ملاحظات الجودة
- تم حذف الصفحات والملفات والصور غير المستخدمة من الثيم.
- تم تنظيف النصوص وتوحيد التسميات داخل الواجهة.
- تم الإبقاء على Bootstrap كمحور رئيسي لكل الواجهات.
