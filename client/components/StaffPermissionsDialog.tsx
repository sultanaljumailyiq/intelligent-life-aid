import React, { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { AlertCircle, Save, X } from "lucide-react";
import { cn } from "@/lib/utils";

interface Permission {
  id: string;
  label: string;
  description: string;
  category: "clinic_management" | "dentist_hub" | "main_app";
}

interface StaffPermissionsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  staff: { id: string; name: string; role: string } | null;
  initialPermissions?: string[];
  onSave: (staffId: string, permissions: string[]) => Promise<void>;
}

const PERMISSIONS_LIST: Permission[] = [
  // Clinic Management Permissions
  { id: "CLINIC_VIEW_DASHBOARD", label: "لوحة التحكم", description: "عرض لوحة تحكم إدارة العيادة", category: "clinic_management" },
  { id: "CLINIC_MANAGE_RESERVATIONS", label: "الحجوزات/المواعيد", description: "إدارة حجوزات ومواعيد المرضى", category: "clinic_management" },
  { id: "CLINIC_VIEW_PATIENTS", label: "المرضى - عرض", description: "عرض ملفات ومعلومات المرضى", category: "clinic_management" },
  { id: "CLINIC_EDIT_PATIENTS", label: "المرضى - تعديل", description: "تعديل ملفات ومعلومات المرضى", category: "clinic_management" },
  { id: "CLINIC_MANAGE_TREATMENTS", label: "العلاجات", description: "إدارة خطط العلاج والوصفات", category: "clinic_management" },
  { id: "CLINIC_MANAGE_LAB", label: "المختبر", description: "إدارة طلبات المختبر والنتائج", category: "clinic_management" },
  { id: "CLINIC_MANAGE_STAFF", label: "الطاقم", description: "إدارة الموظفين والصلاحيات", category: "clinic_management" },
  { id: "CLINIC_VIEW_FINANCE", label: "المالية - عرض", description: "عرض التقارير والفواتير", category: "clinic_management" },
  { id: "CLINIC_MANAGE_FINANCE", label: "المالية - إدارة", description: "تسجيل المدفوعات والفواتير", category: "clinic_management" },
  { id: "CLINIC_VIEW_ASSETS", label: "الأصول المادية - عرض", description: "عرض قائمة الأصول والمعدات", category: "clinic_management" },
  { id: "CLINIC_MANAGE_ASSETS", label: "الأصول المادية - إدارة", description: "إضافة وتعديل الأصول", category: "clinic_management" },
  { id: "CLINIC_VIEW_REPORTS", label: "التقارير", description: "عرض وتصدير التقارير والإحصائيات", category: "clinic_management" },

  // Dentist Hub Permissions
  { id: "DENTIST_HUB_OVERVIEW", label: "النظرة العامة", description: "الوصول إلى لوحة معلومات مركز الأطباء", category: "dentist_hub" },
  { id: "DENTIST_HUB_SMART_CLINIC", label: "العيادة الذكية", description: "استخدام ميزات العيادة الذكية والتحليلات", category: "dentist_hub" },
  { id: "DENTIST_HUB_MANAGE_CLINICS", label: "إدارة العيادات", description: "إضافة وتعديل بيانات العيادات", category: "dentist_hub" },
  { id: "DENTIST_HUB_TASKS", label: "المهام والتذكيرات", description: "إنشاء وإدارة المهام والتذكيرات", category: "dentist_hub" },
  { id: "DENTIST_HUB_MESSAGES", label: "الرسائل والدعم", description: "إرسال واستقبال الرسائل والدعم", category: "dentist_hub" },
  { id: "DENTIST_HUB_NOTIFICATIONS", label: "الإشعارات", description: "عرض والتفاعل مع الإشعارات", category: "dentist_hub" },
  { id: "DENTIST_HUB_FAVORITES", label: "المفضلة", description: "إدارة المفضلة والعناصر المحفوظة", category: "dentist_hub" },

  // Main App Platform Permissions
  { id: "PLATFORM_MARKETPLACE", label: "المتجر", description: "الوصول والتسوق من متجر الأدوات الطبية", category: "main_app" },
  { id: "PLATFORM_COMMUNITY", label: "المجتمع", description: "المشاركة والتفاعل في المجتمع الطبي", category: "main_app" },
  { id: "PLATFORM_JOBS", label: "الوظائف", description: "عرض والتقديم على الوظائ�� المتاحة", category: "main_app" },
];

export function StaffPermissionsDialog({
  open,
  onOpenChange,
  staff,
  initialPermissions = [],
  onSave,
}: StaffPermissionsDialogProps) {
  const [selectedPermissions, setSelectedPermissions] = useState<string[]>(initialPermissions);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    setSelectedPermissions(initialPermissions);
  }, [staff, initialPermissions]);

  const handlePermissionChange = (permissionId: string) => {
    setSelectedPermissions((prev) =>
      prev.includes(permissionId) ? prev.filter((p) => p !== permissionId) : [...prev, permissionId]
    );
  };

  const handleSelectCategory = (category: Permission["category"]) => {
    const categoryPermissions = PERMISSIONS_LIST.filter((p) => p.category === category).map((p) => p.id);
    const allSelected = categoryPermissions.every((p) => selectedPermissions.includes(p));

    if (allSelected) {
      setSelectedPermissions((prev) => prev.filter((p) => !categoryPermissions.includes(p)));
    } else {
      setSelectedPermissions((prev) => [
        ...new Set([...prev, ...categoryPermissions.filter((p) => !prev.includes(p))]),
      ]);
    }
  };

  const handleSave = async () => {
    if (!staff) return;
    setIsSaving(true);
    try {
      await onSave(staff.id, selectedPermissions);
      onOpenChange(false);
    } catch (error) {
      console.error("Failed to save permissions:", error);
    } finally {
      setIsSaving(false);
    }
  };

  const categories: Permission["category"][] = ["clinic_management", "dentist_hub", "main_app"];

  const categoryLabels: Record<Permission["category"], string> = {
    clinic_management: "صلاحيات إدارة العيادة",
    dentist_hub: "صلاحيات مركز الأطباء",
    main_app: "صلاحيات المنصة الرئيسية",
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>إدارة صلاحيات الموظف</DialogTitle>
        </DialogHeader>

        {!staff ? (
          <div className="flex items-center gap-3 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
            <AlertCircle className="w-5 h-5 text-yellow-600" />
            <span className="text-sm text-yellow-700">الرجاء اختيار موظف أولاً</span>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Staff Info */}
            <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <div className="text-sm">
                <span className="font-medium text-gray-900">{staff.name}</span>
                <span className="text-gray-600 mx-2">•</span>
                <span className="text-gray-600">{staff.role}</span>
              </div>
            </div>

            {/* Permissions by Category */}
            {categories.map((category) => {
              const categoryPermissions = PERMISSIONS_LIST.filter((p) => p.category === category);
              const categorySelected = categoryPermissions.filter((p) =>
                selectedPermissions.includes(p.id)
              );
              const allSelected = categorySelected.length === categoryPermissions.length;

              return (
                <div key={category} className="space-y-3">
                  <div className="flex items-center justify-between">
                    <h3 className="font-medium text-gray-900">{categoryLabels[category]}</h3>
                    <button
                      onClick={() => handleSelectCategory(category)}
                      className={cn(
                        "text-sm px-3 py-1 rounded-lg transition-colors",
                        allSelected ? "bg-blue-100 text-blue-700" : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                      )}
                    >
                      {allSelected ? "إلغاء الكل" : "تحديد الكل"}
                    </button>
                  </div>

                  <div className="space-y-2 pl-4">
                    {categoryPermissions.map((permission) => (
                      <label key={permission.id} className="flex items-start gap-3 cursor-pointer group">
                        <Checkbox
                          checked={selectedPermissions.includes(permission.id)}
                          onCheckedChange={() => handlePermissionChange(permission.id)}
                          className="mt-1"
                        />
                        <div className="flex-1">
                          <div className="font-medium text-gray-900 group-hover:text-blue-600">
                            {permission.label}
                          </div>
                          <div className="text-sm text-gray-600">{permission.description}</div>
                        </div>
                      </label>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        )}

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            إلغاء
          </Button>
          <Button onClick={handleSave} disabled={!staff || isSaving}>
            {isSaving ? "جاري الحفظ..." : "حفظ الصلاحيات"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
