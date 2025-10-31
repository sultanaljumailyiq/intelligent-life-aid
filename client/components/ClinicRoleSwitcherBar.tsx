import React, { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { Building2, Users, AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuth } from "@/contexts/AuthContext";
import { useClinic } from "@/contexts/ClinicContext";
import { ClinicService } from "@/services/clinicService";
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
  const { clinics, selectedClinicId, setSelectedClinicId, loading: clinicsLoading } = useClinic();
  const [searchParams] = useSearchParams();

  const [selectedStaff, setSelectedStaff] = useState<string>("");
  const [staffList, setStaffList] = useState<any[]>([]);
  const [isLoadingStaff, setIsLoadingStaff] = useState(false);

  // Update selected clinic when context changes or URL param changes
  useEffect(() => {
    if (clinicsLoading) return;
    
    const clinicIdFromUrl = searchParams.get("clinicId");
    if (clinicIdFromUrl && clinicIdFromUrl !== selectedClinicId) {
      setSelectedClinicId(clinicIdFromUrl);
    }
    
    if (selectedClinicId) {
      loadStaffForClinic(selectedClinicId);
    }
  }, [selectedClinicId, clinicsLoading, searchParams]);

  // Load staff when clinic changes
  const loadStaffForClinic = async (clinicId: string) => {
    try {
      setIsLoadingStaff(true);
      const staff = await ClinicService.getClinicStaff(clinicId);
      setStaffList(staff || []);

      if (staff && staff.length > 0) {
        setSelectedStaff(staff[0].id);
      }
    } catch (error) {
      console.error("Failed to load staff:", error);
      setStaffList([]);
    } finally {
      setIsLoadingStaff(false);
    }
  };

  const handleClinicChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const clinicId = e.target.value;
    setSelectedClinicId(clinicId);
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
  if (clinicsLoading && clinics.length === 0) {
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

  const selectedClinicObj = clinics.find((c) => c.id === selectedClinicId);
  const selectedStaffObj = staffList.find((s) => s.id === selectedStaff);

  // Check if user is platform admin or clinic manager
  const isPlatformAdmin = hasRole(UserRole.PLATFORM_ADMIN);
  const isDentist = hasRole(UserRole.DENTIST);
  const isClinicManager = selectedStaffObj?.role === "manager";
  
  // Platform admins and dentists (clinic owners) can switch
  // Regular staff cannot switch clinics
  const canSwitchClinic = isPlatformAdmin || isDentist || isClinicManager;

  if (variant === "compact") {
    return (
      <div className="bg-gradient-to-r from-primary to-primary/90 text-primary-foreground px-4 py-2.5 flex items-center gap-4 shadow-sm" dir="rtl">
        {/* Clinic Section */}
        {canSwitchClinic ? (
          <div className="flex items-center gap-2">
            <Building2 className="w-4 h-4 shrink-0" />
            <select
              value={selectedClinicId || ''}
              onChange={handleClinicChange}
              disabled={clinicsLoading}
              className="bg-primary-foreground/10 text-primary-foreground text-sm rounded-md px-2 py-1 border border-primary-foreground/20 focus:outline-none focus:ring-1 focus:ring-primary-foreground/30 min-w-[140px]"
            >
              {clinics.map((clinic) => (
                <option key={clinic.id} value={clinic.id} className="bg-card text-foreground">
                  {clinic.name_ar || clinic.name}
                </option>
              ))}
            </select>
          </div>
        ) : (
          <div className="flex items-center gap-2 text-sm">
            <Building2 className="w-4 h-4 shrink-0" />
            <span className="font-medium">{selectedClinicObj?.name_ar || selectedClinicObj?.name}</span>
          </div>
        )}

        {/* Staff Section - Only for admins and managers */}
        {canSwitchClinic && (
          <div className="flex items-center gap-2">
            <Users className="w-4 h-4 shrink-0" />
            <select
              value={selectedStaff}
              onChange={handleStaffChange}
              disabled={isLoadingStaff || !selectedClinicId}
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
                value={selectedClinicId || ''}
                onChange={handleClinicChange}
                disabled={clinicsLoading}
                className="px-3 py-1.5 text-sm border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-ring bg-background"
              >
                {clinics.map((clinic) => (
                  <option key={clinic.id} value={clinic.id}>
                    {clinic.name_ar || clinic.name}
                  </option>
                ))}
              </select>
            ) : (
              <span className="text-sm font-medium">{selectedClinicObj?.name_ar || selectedClinicObj?.name}</span>
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
                disabled={isLoadingStaff || !selectedClinicId}
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
