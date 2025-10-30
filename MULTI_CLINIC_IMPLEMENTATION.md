# خطة تنفيذ نظام تعدد العيادات والموظفين

## ✅ التحديثات المطلوبة

### 1. ✅ sharedClinicData - الدوال التي تدعم clinicId بالفعل
- `getPatients(clinicId?)` ✓
- `getAppointments(clinicId?)` ✓
- `getStaff(clinicId?)` ✓
- `getInventory(clinicId?)` ✓
- `getFinancialRecords(clinicId?)` ✓
- `getLabOrders(clinicId?)` ✓
- `getTreatmentPlans(clinicId?)` ✓
- `getClinicStats(clinicId?)` ✓
- `getStaffTasks(clinicId?)` ✓
- `getStaffReminders(clinicId?)` ✓

### 2. ✅ نظام الصلاحيات
- **مدير العيادة (Clinic Owner)**: يمكنه التبديل بين العيادات
- **الموظفون العاديون**: يرون عيادتهم فقط ولا يمكنهم التبديل

### 3. 📝 الصفحات التي تحتاج تحديث

#### أ. صفحات إدارة العيادة الرئيسية:
- [ ] `client/pages/Patients.tsx` - إضافة ClinicRoleSwitcherBar + استخدام clinicId
- [ ] `client/pages/Reservations.tsx` - إضافة ClinicRoleSwitcherBar + استخدام clinicId
- [ ] `client/pages/Treatments.tsx` - إضافة ClinicRoleSwitcherBar + استخدام clinicId

#### ب. صفحات النظام القديم:
- [ ] `client/pages/ClinicOldLab.tsx` - إضافة ClinicRoleSwitcherBar + استخدام clinicId

#### ج. صفحات المالية:
- [ ] `client/pages/FinanceUnified.tsx` - إضافة ClinicRoleSwitcherBar + استخدام clinicId
- [ ] `client/pages/AssetsUnified.tsx` - إضافة ClinicRoleSwitcherBar + استخدام clinicId
- [ ] `client/pages/Reports.tsx` - إضافة ClinicRoleSwitcherBar + استخدام clinicId

#### د. صفحة مركز الأطباء:
- [ ] `client/pages/DentistHub.tsx` - تحديث لاستخدام clinicId من ClinicContext

### 4. 🔄 نمط التنفيذ الموحد

لكل صفحة، نقوم بـ:

```typescript
import { ClinicRoleSwitcherBar } from "@/components/ClinicRoleSwitcherBar";
import { useState, useEffect } from "react";
import { sharedClinicData } from "@/services/sharedClinicData";

export default function PageName() {
  const [selectedClinicId, setSelectedClinicId] = useState<string>("");
  const [selectedStaffId, setSelectedStaffId] = useState<string>("");
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  // تحميل البيانات عند تغيير العيادة
  useEffect(() => {
    if (selectedClinicId) {
      loadData();
    }
  }, [selectedClinicId, selectedStaffId]);

  const loadData = async () => {
    try {
      setLoading(true);
      const result = await sharedClinicData.getData(selectedClinicId);
      setData(result);
    } catch (error) {
      console.error("Error loading data:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <ClinicRoleSwitcherBar
        variant="full"
        showBadge={true}
        onClinicChange={setSelectedClinicId}
        onStaffChange={setSelectedStaffId}
      />
      
      {/* باقي محتوى الصفحة */}
    </div>
  );
}
```

### 5. 🔒 قواعد الأمان والصلاحيات

```typescript
// في ClinicRoleSwitcherBar
const isClinicManager = hasRole(UserRole.DENTIST) || hasRole(UserRole.PLATFORM_ADMIN);

// المدراء فقط يرون قائمة اختيار العيادات
{isClinicManager && (
  <select value={selectedClinic} onChange={handleClinicChange}>
    {clinics.map(clinic => <option key={clinic.id} value={clinic.id}>
      {clinic.nameAr}
    </option>)}
  </select>
)}

// الموظفون العاديون يرون اسم عيادتهم فقط (read-only)
{!isClinicManager && (
  <div className="px-3 py-2 bg-gray-50 rounded-lg">
    {selectedClinicObj?.nameAr}
  </div>
)}
```

### 6. 📊 تحديثات ClinicContext

يجب أن يوفر ClinicContext:
- `selectedClinicId`: العيادة المختارة حالياً
- `setSelectedClinicId`: دالة لتغيير العيادة
- `clinics`: قائمة جميع العيادات
- `selectedClinic`: كائن العيادة المختارة
- `loading`: حالة التحميل

### 7. 🎯 النتيجة النهائية المتوقعة

1. ✅ كل عيادة لها موظفيها المنفصلين
2. ✅ المدراء يمكنهم التبديل بين العيادات
3. ✅ الموظفون يرون عيادتهم فقط
4. ✅ جميع البيانات (مرضى، حجوزات، علاجات، مالية) مصفاة حسب العيادة
5. ✅ مركز الأطباء يعرض بيانات العيادة المختارة فقط
6. ✅ نظام موحد عبر جميع الصفحات

## 🔧 الأدوات والمكونات المستخدمة

- ✅ `ClinicRoleSwitcherBar` - شريط التبديل الرئيسي
- ✅ `ClinicContext` - سياق العيادة العالمي
- ✅ `StaffAuthContext` - سياق مصادقة الموظفين
- ✅ `sharedClinicData` - خدمة البيانات المشتركة
- ✅ `AuthContext` - للتحقق من الأدوار والصلاحيات

## 📅 ترتيب التنفيذ

1. ✅ التحقق من sharedClinicData (تم - جميع الدوال تدعم clinicId)
2. 🔄 تحديث الصفحات الأساسية (Patients, Reservations, Treatments)
3. 🔄 تحديث صفحات المالية والتقارير
4. 🔄 تحديث مركز الأطباء
5. ✅ اختبار النظام بالكامل
