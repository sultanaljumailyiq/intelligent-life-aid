import React, { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { Shield, Store, Stethoscope } from "lucide-react";
import { UserRole } from "@/types/system";
import { toast } from "sonner";

interface RoleSwitcherModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function RoleSwitcherModal({
  open,
  onOpenChange,
}: RoleSwitcherModalProps) {
  const { user, isAdmin } = useAuth();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  // Only show to admins
  if (!isAdmin()) {
    return null;
  }

  const roles = [
    {
      value: UserRole.PLATFORM_ADMIN,
      label: "مدير النظام",
      arabicLabel: "Admin",
      icon: Shield,
      color: "text-red-600",
      bgColor: "bg-red-50 hover:bg-red-100",
      description: "Full system access and control",
    },
    {
      value: UserRole.DENTIST,
      label: "طبيب الأسنان",
      arabicLabel: "Dentist",
      icon: Stethoscope,
      color: "text-blue-600",
      bgColor: "bg-blue-50 hover:bg-blue-100",
      description: "Clinic management and patient care",
    },
    {
      value: UserRole.SUPPLIER,
      label: "المورد",
      arabicLabel: "Supplier",
      icon: Store,
      color: "text-green-600",
      bgColor: "bg-green-50 hover:bg-green-100",
      description: "Product management and orders",
    },
  ];

  const handleRoleSwitch = async (newRole: UserRole) => {
    setIsLoading(true);
    try {
      // Create a temporary user session with the selected role
      // Store the temp role in localStorage for this session
      localStorage.setItem("temp_switched_role", newRole);
      
      // Update local auth state to reflect the role switch
      // This will trigger a UI refresh
      window.location.reload();

      // Navigate to the appropriate dashboard
      if (newRole === UserRole.PLATFORM_ADMIN) {
        navigate("/admin/dashboard");
      } else if (newRole === UserRole.DENTIST) {
        navigate("/dentist-hub");
      } else if (newRole === UserRole.SUPPLIER) {
        navigate("/supplier/dashboard");
      }

      onOpenChange(false);
      toast.success(`تم التبديل إلى دور ${roles.find(r => r.value === newRole)?.label}`);
    } catch (error) {
      toast.error("فشل تبديل الدور");
      console.error("Role switch error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const currentRole = roles.find(r => r.value === user?.role);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="text-2xl">تبديل الدور</DialogTitle>
          <p className="text-sm text-gray-500 mt-2">
            الدور الحالي: <span className="font-semibold">{currentRole?.label}</span>
          </p>
        </DialogHeader>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 py-6">
          {roles.map((role) => {
            const Icon = role.icon;
            const isCurrentRole = user?.role === role.value;

            return (
              <button
                key={role.value}
                onClick={() => handleRoleSwitch(role.value)}
                disabled={isLoading || isCurrentRole}
                className={`p-4 rounded-lg border-2 transition-all ${
                  isCurrentRole
                    ? "border-green-500 bg-green-50"
                    : role.bgColor + " border-gray-200"
                } disabled:opacity-50`}
              >
                <div className="flex flex-col items-center text-center gap-3">
                  <Icon className={`w-8 h-8 ${role.color}`} />
                  <div>
                    <h3 className="font-semibold text-gray-900">{role.label}</h3>
                    <p className="text-xs text-gray-600 mt-1">{role.description}</p>
                  </div>
                  {isCurrentRole && (
                    <span className="text-xs text-green-600 font-semibold">
                      (الدور الحالي)
                    </span>
                  )}
                </div>

                {!isCurrentRole && (
                  <Button
                    size="sm"
                    className="w-full mt-3"
                    onClick={() => handleRoleSwitch(role.value)}
                    disabled={isLoading}
                  >
                    {isLoading ? "جاري..." : "تبديل"}
                  </Button>
                )}
              </button>
            );
          })}
        </div>

        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 text-sm text-yellow-800">
          <p className="font-semibold mb-1">⚠️ ملاحظة:</p>
          <p>تبديل الدور سيعيد تحميل الصفحة ويغير واجهة المستخدم بناءً على صلاحيات الدور الجديد.</p>
        </div>
      </DialogContent>
    </Dialog>
  );
}
