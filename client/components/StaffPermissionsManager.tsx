/**
 * StaffPermissionsManager
 * Manage staff member permissions for clinic operations
 * Allows dentist hub users to assign specific permissions to staff members
 */

import React, { useState, useEffect } from "react";
import {
  Shield,
  Eye,
  Edit,
  Clock,
  BarChart3,
  Settings,
  Plus,
  Trash2,
  Save,
  X,
  Users,
  CheckCircle,
  AlertCircle,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

export type Permission =
  | "VIEW_PATIENTS"
  | "EDIT_TREATMENTS"
  | "MANAGE_APPOINTMENTS"
  | "VIEW_ANALYTICS"
  | "EDIT_CLINIC_INFO";

export interface StaffMember {
  id: string;
  name: string;
  email: string;
  role: "dentist" | "assistant" | "receptionist" | "admin";
  permissions: Permission[];
  joinedDate: string;
  isActive: boolean;
}

interface StaffPermissionsManagerProps {
  clinicId: string;
  onClose?: () => void;
}

const AVAILABLE_PERMISSIONS: Record<Permission, {
  label: string;
  description: string;
  icon: React.ReactNode;
  category: "view" | "edit" | "manage";
}> = {
  VIEW_PATIENTS: {
    label: "عرض المرضى",
    description: "عرض بيانات المرضى والملفات الشخصية",
    icon: <Eye className="w-4 h-4" />,
    category: "view",
  },
  EDIT_TREATMENTS: {
    label: "تعديل العلاجات",
    description: "تعديل خطط العلاج وسجلات المعالجة",
    icon: <Edit className="w-4 h-4" />,
    category: "edit",
  },
  MANAGE_APPOINTMENTS: {
    label: "إدارة المواعيد",
    description: "حجز وإلغاء وإعادة جدولة المواعيد",
    icon: <Clock className="w-4 h-4" />,
    category: "manage",
  },
  VIEW_ANALYTICS: {
    label: "عرض التحليلات",
    description: "عرض تقارير الأداء والإحصائيات",
    icon: <BarChart3 className="w-4 h-4" />,
    category: "view",
  },
  EDIT_CLINIC_INFO: {
    label: "تعديل معلومات العيادة",
    description: "تعديل بيانات العيادة والإعدادات",
    icon: <Settings className="w-4 h-4" />,
    category: "edit",
  },
};

const DEFAULT_PERMISSIONS_BY_ROLE: Record<string, Permission[]> = {
  dentist: [
    "VIEW_PATIENTS",
    "EDIT_TREATMENTS",
    "MANAGE_APPOINTMENTS",
    "VIEW_ANALYTICS",
  ],
  assistant: ["VIEW_PATIENTS", "MANAGE_APPOINTMENTS"],
  receptionist: ["VIEW_PATIENTS", "MANAGE_APPOINTMENTS"],
  admin: [
    "VIEW_PATIENTS",
    "EDIT_TREATMENTS",
    "MANAGE_APPOINTMENTS",
    "VIEW_ANALYTICS",
    "EDIT_CLINIC_INFO",
  ],
};

export default function StaffPermissionsManager({
  clinicId,
  onClose,
}: StaffPermissionsManagerProps) {
  const [staff, setStaff] = useState<StaffMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingStaffId, setEditingStaffId] = useState<string | null>(null);
  const [editingPermissions, setEditingPermissions] = useState<Permission[]>([]);
  const [showAddForm, setShowAddForm] = useState(false);

  useEffect(() => {
    loadStaff();
  }, [clinicId]);

  const loadStaff = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/clinics/${clinicId}/staff`);

      if (!response.ok) {
        throw new Error("Failed to load staff members");
      }

      const data = await response.json();
      setStaff(data);
    } catch (error) {
      console.error("Error loading staff:", error);
      toast.error("فشل تحميل الموظفين");
    } finally {
      setLoading(false);
    }
  };

  const handleEditStaff = (staffMember: StaffMember) => {
    setEditingStaffId(staffMember.id);
    setEditingPermissions([...staffMember.permissions]);
  };

  const handlePermissionToggle = (permission: Permission) => {
    setEditingPermissions((prev) =>
      prev.includes(permission)
        ? prev.filter((p) => p !== permission)
        : [...prev, permission],
    );
  };

  const handleSavePermissions = async () => {
    if (!editingStaffId) return;

    try {
      const response = await fetch(
        `/api/clinics/${clinicId}/staff/${editingStaffId}/permissions`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            permissions: editingPermissions,
          }),
        },
      );

      if (!response.ok) {
        throw new Error("Failed to update permissions");
      }

      // Update local state
      setStaff((prev) =>
        prev.map((s) =>
          s.id === editingStaffId
            ? { ...s, permissions: editingPermissions }
            : s,
        ),
      );

      setEditingStaffId(null);
      toast.success("تم تحديث الصلاحيات بنجاح");
    } catch (error) {
      console.error("Error saving permissions:", error);
      toast.error("فشل تحديث الصلاحيات");
    }
  };

  const handleCancelEdit = () => {
    setEditingStaffId(null);
    setEditingPermissions([]);
  };

  const handleRemoveStaff = async (staffId: string) => {
    if (!confirm("هل تريد فعلا إزالة هذا الموظف؟")) {
      return;
    }

    try {
      const response = await fetch(
        `/api/clinics/${clinicId}/staff/${staffId}`,
        {
          method: "DELETE",
        },
      );

      if (!response.ok) {
        throw new Error("Failed to remove staff member");
      }

      setStaff((prev) => prev.filter((s) => s.id !== staffId));
      toast.success("تم إزالة الموظف بنجاح");
    } catch (error) {
      console.error("Error removing staff:", error);
      toast.error("فشل إزالة الموظف");
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6 p-6 bg-gray-50 rounded-xl">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Shield className="w-6 h-6 text-purple-600" />
          <h2 className="text-2xl font-bold text-gray-900">إدارة صلاحيات الموظفين</h2>
        </div>
        <Button
          onClick={() => setShowAddForm(!showAddForm)}
          className="bg-purple-600 hover:bg-purple-700"
        >
          <Plus className="w-4 h-4 ml-2" />
          إضافة موظف
        </Button>
      </div>

      {/* Add Staff Form */}
      {showAddForm && (
        <div className="bg-white border border-purple-200 rounded-xl p-6">
          <p className="text-sm text-gray-600 mb-4">
            ⚠️ لإضافة موظف جديد، استخدم صفحة إدار�� الموظفين المتقدمة
          </p>
          <Button
            variant="outline"
            onClick={() => {
              window.location.href = `/clinic/advanced-staff-management?clinicId=${clinicId}`;
            }}
          >
            الذهاب لإدارة الموظفين
          </Button>
        </div>
      )}

      {/* Staff List */}
      {staff.length === 0 ? (
        <div className="bg-white rounded-xl border border-dashed border-gray-300 p-8 text-center">
          <Users className="w-12 h-12 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-600 mb-4">لا توجد موظفين مسجلين</p>
          <Button
            onClick={() => {
              window.location.href = `/clinic/advanced-staff-management?clinicId=${clinicId}`;
            }}
          >
            إضافة موظف
          </Button>
        </div>
      ) : (
        <div className="grid gap-4">
          {staff.map((staffMember) => (
            <div
              key={staffMember.id}
              className="bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow"
            >
              {/* Staff Header */}
              <div className="p-4 border-b border-gray-100 flex items-center justify-between">
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-900">
                    {staffMember.name}
                  </h3>
                  <p className="text-sm text-gray-600 mt-1">
                    {staffMember.email} • {staffMember.role}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    تاريخ الانضمام:{" "}
                    {new Date(staffMember.joinedDate).toLocaleDateString(
                      "ar-EG",
                    )}
                  </p>
                </div>
                {!staffMember.isActive && (
                  <AlertCircle className="w-5 h-5 text-red-600 ml-2" />
                )}
              </div>

              {/* Permissions */}
              {editingStaffId === staffMember.id ? (
                <div className="p-4 bg-gray-50 space-y-4">
                  {/* View Permissions */}
                  <div>
                    <h4 className="text-sm font-semibold text-gray-900 mb-3">
                      صلاحيات العرض
                    </h4>
                    <div className="space-y-2">
                      {(
                        Object.entries(AVAILABLE_PERMISSIONS) as [
                          Permission,
                          typeof AVAILABLE_PERMISSIONS["VIEW_PATIENTS"],
                        ][]
                      )
                        .filter(([_, perm]) => perm.category === "view")
                        .map(([key, perm]) => (
                          <label
                            key={key}
                            className="flex items-center gap-3 p-3 bg-white rounded-lg border border-gray-200 hover:border-purple-300 cursor-pointer transition-colors"
                          >
                            <input
                              type="checkbox"
                              checked={editingPermissions.includes(key)}
                              onChange={() => handlePermissionToggle(key)}
                              className="w-4 h-4 text-purple-600 rounded"
                            />
                            <div className="flex-1">
                              <div className="flex items-center gap-2">
                                {perm.icon}
                                <span className="font-medium text-gray-900">
                                  {perm.label}
                                </span>
                              </div>
                              <p className="text-xs text-gray-600 mt-1">
                                {perm.description}
                              </p>
                            </div>
                          </label>
                        ))}
                    </div>
                  </div>

                  {/* Edit Permissions */}
                  <div>
                    <h4 className="text-sm font-semibold text-gray-900 mb-3">
                      صلاحيات التعديل
                    </h4>
                    <div className="space-y-2">
                      {(
                        Object.entries(AVAILABLE_PERMISSIONS) as [
                          Permission,
                          typeof AVAILABLE_PERMISSIONS["EDIT_TREATMENTS"],
                        ][]
                      )
                        .filter(([_, perm]) => perm.category === "edit")
                        .map(([key, perm]) => (
                          <label
                            key={key}
                            className="flex items-center gap-3 p-3 bg-white rounded-lg border border-gray-200 hover:border-purple-300 cursor-pointer transition-colors"
                          >
                            <input
                              type="checkbox"
                              checked={editingPermissions.includes(key)}
                              onChange={() => handlePermissionToggle(key)}
                              className="w-4 h-4 text-purple-600 rounded"
                            />
                            <div className="flex-1">
                              <div className="flex items-center gap-2">
                                {perm.icon}
                                <span className="font-medium text-gray-900">
                                  {perm.label}
                                </span>
                              </div>
                              <p className="text-xs text-gray-600 mt-1">
                                {perm.description}
                              </p>
                            </div>
                          </label>
                        ))}
                    </div>
                  </div>

                  {/* Manage Permissions */}
                  <div>
                    <h4 className="text-sm font-semibold text-gray-900 mb-3">
                      صلاحيات الإدارة
                    </h4>
                    <div className="space-y-2">
                      {(
                        Object.entries(AVAILABLE_PERMISSIONS) as [
                          Permission,
                          typeof AVAILABLE_PERMISSIONS["MANAGE_APPOINTMENTS"],
                        ][]
                      )
                        .filter(([_, perm]) => perm.category === "manage")
                        .map(([key, perm]) => (
                          <label
                            key={key}
                            className="flex items-center gap-3 p-3 bg-white rounded-lg border border-gray-200 hover:border-purple-300 cursor-pointer transition-colors"
                          >
                            <input
                              type="checkbox"
                              checked={editingPermissions.includes(key)}
                              onChange={() => handlePermissionToggle(key)}
                              className="w-4 h-4 text-purple-600 rounded"
                            />
                            <div className="flex-1">
                              <div className="flex items-center gap-2">
                                {perm.icon}
                                <span className="font-medium text-gray-900">
                                  {perm.label}
                                </span>
                              </div>
                              <p className="text-xs text-gray-600 mt-1">
                                {perm.description}
                              </p>
                            </div>
                          </label>
                        ))}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-2 pt-4 border-t border-gray-200">
                    <Button
                      onClick={handleSavePermissions}
                      className="flex-1 bg-green-600 hover:bg-green-700"
                    >
                      <Save className="w-4 h-4 ml-2" />
                      حفظ التغييرات
                    </Button>
                    <Button
                      onClick={handleCancelEdit}
                      variant="outline"
                      className="flex-1"
                    >
                      <X className="w-4 h-4 ml-2" />
                      إلغاء
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="p-4">
                  {staffMember.permissions.length === 0 ? (
                    <p className="text-sm text-gray-500 mb-4">
                      لم يتم تحديد أي صلاحيات
                    </p>
                  ) : (
                    <div className="flex flex-wrap gap-2 mb-4">
                      {staffMember.permissions.map((perm) => (
                        <span
                          key={perm}
                          className="inline-flex items-center gap-1 px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-xs font-medium"
                        >
                          <CheckCircle className="w-3 h-3" />
                          {AVAILABLE_PERMISSIONS[perm]?.label}
                        </span>
                      ))}
                    </div>
                  )}

                  <div className="flex gap-2">
                    <Button
                      onClick={() => handleEditStaff(staffMember)}
                      variant="outline"
                      size="sm"
                      className="flex-1"
                    >
                      <Edit className="w-4 h-4 ml-2" />
                      تعديل الصلاحيات
                    </Button>
                    <Button
                      onClick={() => handleRemoveStaff(staffMember.id)}
                      variant="destructive"
                      size="sm"
                      className="flex-1"
                    >
                      <Trash2 className="w-4 h-4 ml-2" />
                      إزالة
                    </Button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Footer */}
      {onClose && (
        <div className="flex justify-end pt-4 border-t border-gray-200">
          <Button onClick={onClose} variant="outline">
            إغلاق
          </Button>
        </div>
      )}
    </div>
  );
}
