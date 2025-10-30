import React, { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { Building2, Users, AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import { sharedClinicData } from "@/services/sharedClinicData";
import { useAuth } from "@/contexts/AuthContext";
import { UserRole } from "@/types/system";

interface SwitcherBarProps {
  variant?: "compact" | "full";
  showBadge?: boolean;
  onClinicChange?: (clinicId: string) => void;
  onStaffChange?: (staffId: string) => void;
}

export function ClinicRoleSwitcherBar({
  variant = "full",
  showBadge = true,
  onClinicChange,
  onStaffChange,
}: SwitcherBarProps) {
  const { user, hasRole } = useAuth();
  const [searchParams] = useSearchParams();

  const [clinics, setClinics] = useState<any[]>([]);
  const [selectedClinic, setSelectedClinic] = useState<string>("");
  const [selectedStaff, setSelectedStaff] = useState<string>("");
  const [staffList, setStaffList] = useState<any[]>([]);
  const [isLoadingClinics, setIsLoadingClinics] = useState(true);
  const [isLoadingStaff, setIsLoadingStaff] = useState(false);

  // Check if user is clinic owner/manager
  const isClinicManager = 
    hasRole(UserRole.DENTIST) || 
    hasRole(UserRole.PLATFORM_ADMIN) ||
    user?.isOwner;

  // Load clinics on mount
  useEffect(() => {
    const loadClinics = async () => {
      try {
        const data = await sharedClinicData.getClinics();
        setClinics(data || []);

        // Get clinic ID from URL or use first clinic
        const clinicIdFromUrl = searchParams.get("clinicId");
        let defaultClinicId = clinicIdFromUrl || (data && data.length > 0 ? data[0].id : "clinic-1");
        
        setSelectedClinic(defaultClinicId);
        loadStaffForClinic(defaultClinicId);
      } catch (error) {
        console.error("Failed to load clinics:", error);
      } finally {
        setIsLoadingClinics(false);
      }
    };

    loadClinics();
  }, [searchParams]);

  // Load staff when clinic changes
  const loadStaffForClinic = async (clinicId: string) => {
    try {
      setIsLoadingStaff(true);
      // Pass clinicId to getStaff to filter by clinic
      const staff = await sharedClinicData.getStaff(clinicId);
      setStaffList(staff || []);

      if (staff && staff.length > 0) {
        const defaultStaffId = staff[0].id || "doc1";
        setSelectedStaff(defaultStaffId);
      }
    } catch (error) {
      console.error("Failed to load staff:", error);
    } finally {
      setIsLoadingStaff(false);
    }
  };

  const handleClinicChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const clinicId = e.target.value;
    setSelectedClinic(clinicId);
    loadStaffForClinic(clinicId);
    onClinicChange?.(clinicId);

    // Update URL
    const newSearchParams = new URLSearchParams(window.location.search);
    newSearchParams.set("clinicId", clinicId);
    window.history.replaceState(null, "", `?${newSearchParams.toString()}`);
  };

  const handleStaffChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const staffId = e.target.value;
    setSelectedStaff(staffId);
    onStaffChange?.(staffId);
  };

  // If no clinics available, show loading state
  if (isLoadingClinics && clinics.length === 0) {
    return (
      <div className="bg-gradient-to-r from-teal-600 to-teal-700 text-white px-4 py-4 rounded-xl shadow-md">
        <div className="flex items-center gap-2 text-sm">جاري تحميل العيادات...</div>
      </div>
    );
  }

  // Show warning if staff tries to access different clinic
  if (!isClinicManager && selectedClinic && user?.clinicId && user.clinicId !== selectedClinic) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-xl p-4">
        <div className="flex items-center gap-2 text-red-700">
          <AlertCircle className="w-5 h-5" />
          <span>ليس لديك صلاحية للوصول إلى هذه العيادة</span>
        </div>
      </div>
    );
  }

  const selectedClinicObj = clinics.find((c) => c.id === selectedClinic);
  const selectedStaffObj = staffList.find((s) => s.id === selectedStaff);

  if (variant === "compact") {
    return (
      <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white px-4 py-2 flex items-center gap-3" dir="rtl">
        {/* Clinic Selection - Only for managers */}
        {isClinicManager && (
          <div className="flex items-center gap-2">
            <Building2 className="w-4 h-4" />
            <select
              value={selectedClinic}
              onChange={handleClinicChange}
              disabled={isLoadingClinics}
              className="bg-blue-700 text-white text-sm rounded px-2 py-1 border border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-300"
            >
              <option value="">اختر العيادة</option>
              {clinics.map((clinic) => (
                <option key={clinic.id} value={clinic.id}>
                  {clinic.nameAr || clinic.name}
                </option>
              ))}
            </select>
          </div>
        )}

        {/* Clinic Display - For regular staff */}
        {!isClinicManager && selectedClinicObj && (
          <div className="flex items-center gap-2">
            <Building2 className="w-4 h-4" />
            <span className="text-sm">{selectedClinicObj.nameAr || selectedClinicObj.name}</span>
          </div>
        )}

        {/* Staff Selection */}
        <div className="flex items-center gap-2">
          <Users className="w-4 h-4" />
          <select
            value={selectedStaff}
            onChange={handleStaffChange}
            disabled={isLoadingStaff || !selectedClinic}
            className="bg-blue-700 text-white text-sm rounded px-2 py-1 border border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-300"
          >
            <option value="">اختر الموظف</option>
            {staffList.map((staff) => (
              <option key={staff.id} value={staff.id}>
                {staff.name}
              </option>
            ))}
          </select>
        </div>

        {/* Display current role (read-only) */}
        {selectedStaffObj && (
          <div className="flex items-center gap-2 ml-4 pl-4 border-l border-blue-500">
            <span className="text-sm font-medium">{getRoleLabel(selectedStaffObj.role)}</span>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="bg-white border-b border-gray-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between py-4 gap-6" dir="rtl">
          <div className="text-sm font-medium text-gray-700">
            إدارة العيادات والموظفين
          </div>

          <div className="flex items-center gap-6">
            {/* Clinic Selection - Only for managers */}
            {isClinicManager ? (
              <div className="flex items-center gap-3">
                <Building2 className="w-5 h-5 text-blue-600" />
                <div className="flex flex-col">
                  <label className="text-xs font-medium text-gray-600 mb-1">
                    اختر العيادة
                  </label>
                  <select
                    value={selectedClinic}
                    onChange={handleClinicChange}
                    disabled={isLoadingClinics}
                    className="px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white text-gray-900"
                  >
                    <option value="">اختر العيادة</option>
                    {clinics.map((clinic) => (
                      <option key={clinic.id} value={clinic.id}>
                        {clinic.nameAr || clinic.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            ) : (
              <div className="flex items-center gap-3">
                <Building2 className="w-5 h-5 text-blue-600" />
                <div className="flex flex-col">
                  <label className="text-xs font-medium text-gray-600 mb-1">
                    العيادة
                  </label>
                  <div className="px-3 py-2 text-sm bg-gray-50 rounded-lg text-gray-700 border border-gray-200">
                    {selectedClinicObj?.nameAr || selectedClinicObj?.name || "العيادة الرئيسية"}
                  </div>
                </div>
              </div>
            )}

            {/* Staff Selection */}
            <div className="flex items-center gap-3">
              <Users className="w-5 h-5 text-green-600" />
              <div className="flex flex-col">
                <label className="text-xs font-medium text-gray-600 mb-1">
                  اختر الموظف
                </label>
                <select
                  value={selectedStaff}
                  onChange={handleStaffChange}
                  disabled={isLoadingStaff || !selectedClinic}
                  className="px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 bg-white text-gray-900"
                >
                  <option value="">اختر الموظف</option>
                  {staffList.map((staff) => (
                    <option key={staff.id} value={staff.id}>
                      {staff.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Role Display (Read-only) */}
            {selectedStaffObj && (
              <div className="flex items-center gap-3 px-3 py-2 bg-purple-50 rounded-lg">
                <div className="text-sm">
                  <span className="font-medium text-purple-700">{getRoleLabel(selectedStaffObj.role)}</span>
                </div>
              </div>
            )}

            {/* Display current info badge */}
            {showBadge && selectedClinicObj && selectedStaffObj && (
              <div className="flex items-center gap-2 px-3 py-2 bg-blue-50 rounded-lg text-sm border border-blue-200">
                <div className="text-gray-700">
                  <span className="font-medium">{selectedClinicObj.nameAr}</span>
                  {" • "}
                  <span className="text-gray-600">{selectedStaffObj.name}</span>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// Helper function to get Arabic role label
function getRoleLabel(role: string): string {
  const roleMap: Record<string, string> = {
    doctor: "طبيب",
    nurse: "ممرضة",
    assistant: "مساعد",
    receptionist: "موظف استقبال",
    manager: "مدير العيادة",
  };
  return roleMap[role] || role;
}
