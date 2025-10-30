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

  // Show warning if staff tries to access different clinic (check removed as User type doesn't have clinicId)
  // This check would require extending the User interface with clinicId property
  if (false) {
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

  // Check if user is platform admin or clinic manager
  const isPlatformAdmin = hasRole(UserRole.PLATFORM_ADMIN);
  const isClinicOwner = selectedStaffObj?.role === "manager";
  const canSwitchClinic = isPlatformAdmin || isClinicOwner;

  if (variant === "compact") {
    return (
      <div className="bg-gradient-to-r from-primary to-primary/90 text-primary-foreground px-4 py-2.5 flex items-center gap-4 shadow-sm" dir="rtl">
        {/* Clinic Section */}
        {canSwitchClinic ? (
          <div className="flex items-center gap-2">
            <Building2 className="w-4 h-4 shrink-0" />
            <select
              value={selectedClinic}
              onChange={handleClinicChange}
              disabled={isLoadingClinics}
              className="bg-primary-foreground/10 text-primary-foreground text-sm rounded-md px-2 py-1 border border-primary-foreground/20 focus:outline-none focus:ring-1 focus:ring-primary-foreground/30 min-w-[140px]"
            >
              {clinics.map((clinic) => (
                <option key={clinic.id} value={clinic.id} className="bg-card text-foreground">
                  {clinic.nameAr || clinic.name}
                </option>
              ))}
            </select>
          </div>
        ) : (
          <div className="flex items-center gap-2 text-sm">
            <Building2 className="w-4 h-4 shrink-0" />
            <span className="font-medium">{selectedClinicObj?.nameAr || selectedClinicObj?.name}</span>
          </div>
        )}

        {/* Staff Section - Only for admins and managers */}
        {canSwitchClinic && (
          <div className="flex items-center gap-2">
            <Users className="w-4 h-4 shrink-0" />
            <select
              value={selectedStaff}
              onChange={handleStaffChange}
              disabled={isLoadingStaff || !selectedClinic}
              className="bg-primary-foreground/10 text-primary-foreground text-sm rounded-md px-2 py-1 border border-primary-foreground/20 focus:outline-none focus:ring-1 focus:ring-primary-foreground/30 min-w-[140px]"
            >
              {staffList.map((staff) => (
                <option key={staff.id} value={staff.id} className="bg-card text-foreground">
                  {staff.name}
                </option>
              ))}
            </select>
          </div>
        )}

        {/* Staff name for non-managers */}
        {!canSwitchClinic && selectedStaffObj && (
          <div className="flex items-center gap-2 text-sm">
            <Users className="w-4 h-4 shrink-0" />
            <span className="font-medium">{selectedStaffObj.name}</span>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="bg-card border-b border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-4 py-3" dir="rtl">
          {/* Clinic Section */}
          <div className="flex items-center gap-2">
            <Building2 className="w-4 h-4 text-muted-foreground" />
            {canSwitchClinic ? (
              <select
                value={selectedClinic}
                onChange={handleClinicChange}
                disabled={isLoadingClinics}
                className="px-3 py-1.5 text-sm border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-ring bg-background"
              >
                {clinics.map((clinic) => (
                  <option key={clinic.id} value={clinic.id}>
                    {clinic.nameAr || clinic.name}
                  </option>
                ))}
              </select>
            ) : (
              <span className="text-sm font-medium">{selectedClinicObj?.nameAr || selectedClinicObj?.name}</span>
            )}
          </div>

          {/* Divider */}
          <div className="h-4 w-px bg-border" />

          {/* Staff Section */}
          <div className="flex items-center gap-2">
            <Users className="w-4 h-4 text-muted-foreground" />
            {canSwitchClinic ? (
              <select
                value={selectedStaff}
                onChange={handleStaffChange}
                disabled={isLoadingStaff || !selectedClinic}
                className="px-3 py-1.5 text-sm border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-ring bg-background"
              >
                {staffList.map((staff) => (
                  <option key={staff.id} value={staff.id}>
                    {staff.name}
                  </option>
                ))}
              </select>
            ) : (
              <span className="text-sm font-medium">{selectedStaffObj?.name}</span>
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
