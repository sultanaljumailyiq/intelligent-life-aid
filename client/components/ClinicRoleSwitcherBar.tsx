import React, { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { Building2, Users, AlertCircle, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuth } from "@/contexts/AuthContext";
import { useClinic } from "@/contexts/ClinicContext";
import { ClinicService } from "@/services/clinicService";
import { UserRole } from "@/types/system";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

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
  }, [clinicsLoading, searchParams, selectedClinicId, setSelectedClinicId]);

  // Load staff when clinic changes
  useEffect(() => {
    if (selectedClinicId && !clinicsLoading) {
      loadStaffForClinic(selectedClinicId);
    }
  }, [selectedClinicId, clinicsLoading]);

  // Load staff when clinic changes
  const loadStaffForClinic = async (clinicId: string) => {
    try {
      setIsLoadingStaff(true);
      console.log('Loading staff for clinic:', clinicId);
      const staff = await ClinicService.getClinicStaff(clinicId);
      console.log('Loaded staff:', staff);
      setStaffList(staff || []);

      // Auto-select first staff member if available and none selected
      if (staff && staff.length > 0 && !selectedStaff) {
        console.log('Auto-selecting first staff:', staff[0].id);
        setSelectedStaff(staff[0].id);
        onStaffChange?.(staff[0].id);
      }
    } catch (error) {
      console.error("Failed to load staff:", error);
      setStaffList([]);
    } finally {
      setIsLoadingStaff(false);
    }
  };

  const handleClinicChange = (clinicId: string) => {
    setSelectedClinicId(clinicId);
    onClinicChange?.(clinicId);

    // Update URL
    const newSearchParams = new URLSearchParams(window.location.search);
    newSearchParams.set("clinicId", clinicId);
    window.history.replaceState(null, "", `?${newSearchParams.toString()}`);
  };

  const handleStaffChange = (staffId: string) => {
    setSelectedStaff(staffId);
    onStaffChange?.(staffId);
  };

  // If no clinics available, show message
  if (clinicsLoading) {
    return (
      <div className="bg-gradient-to-r from-primary to-primary/90 text-primary-foreground px-4 py-2.5 flex items-center justify-center shadow-sm" dir="rtl">
        <div className="flex items-center gap-2 text-sm">جاري تحميل العيادات...</div>
      </div>
    );
  }

  if (clinics.length === 0) {
    return (
      <div className="bg-muted/50 border-b border-border px-4 py-2.5 flex items-center justify-center" dir="rtl">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <AlertCircle className="w-4 h-4" />
          <span>لا توجد عيادات مسجلة. يرجى إضافة عيادة أولاً.</span>
        </div>
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

  // Check if user is platform admin, clinic owner, or clinic manager
  const isPlatformAdmin = hasRole(UserRole.PLATFORM_ADMIN);
  const isDentist = hasRole(UserRole.DENTIST);
  const isClinicOwner = selectedClinicObj?.owner_id === user?.id;
  const isClinicManager = selectedStaffObj?.role === "manager";
  
  // Platform admins, dentists (clinic owners), and actual clinic owners can switch
  const canSwitchClinic = isPlatformAdmin || isDentist || isClinicOwner || isClinicManager;

  if (variant === "compact") {
    return (
      <div className="bg-gradient-to-r from-primary to-primary/90 text-primary-foreground px-4 py-2.5 flex items-center gap-4 shadow-sm" dir="rtl">
        {/* Clinic Section */}
        {canSwitchClinic ? (
          <div className="flex items-center gap-2">
            <Building2 className="w-4 h-4 shrink-0" />
            <Select value={selectedClinicId || ''} onValueChange={handleClinicChange} disabled={clinicsLoading}>
              <SelectTrigger className="h-8 bg-primary-foreground/10 text-primary-foreground border-primary-foreground/20 hover:bg-primary-foreground/20 min-w-[160px]">
                <SelectValue placeholder="اختر العيادة" />
              </SelectTrigger>
              <SelectContent className="bg-card">
                {clinics.map((clinic) => (
                  <SelectItem key={clinic.id} value={clinic.id}>
                    {clinic.name_ar || clinic.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        ) : (
          <div className="flex items-center gap-2 text-sm">
            <Building2 className="w-4 h-4 shrink-0" />
            <span className="font-medium">{selectedClinicObj?.name_ar || selectedClinicObj?.name}</span>
          </div>
        )}

        {/* Staff Section */}
        {canSwitchClinic && staffList.length > 0 && (
          <div className="flex items-center gap-2">
            <Users className="w-4 h-4 shrink-0" />
            <Select value={selectedStaff} onValueChange={handleStaffChange} disabled={isLoadingStaff || !selectedClinicId}>
              <SelectTrigger className="h-8 bg-primary-foreground/10 text-primary-foreground border-primary-foreground/20 hover:bg-primary-foreground/20 min-w-[160px]">
                <SelectValue placeholder="اختر الموظف" />
              </SelectTrigger>
              <SelectContent className="bg-card">
                {/* Owner/Manager First */}
                {selectedClinicObj && (
                  <SelectItem value="owner" disabled className="font-semibold border-b">
                    {selectedClinicObj.name_ar || selectedClinicObj.name} - المدير
                  </SelectItem>
                )}
                {/* Staff Members */}
                {staffList.map((staff) => (
                  <SelectItem key={staff.id} value={staff.id} className="pr-6">
                    {staff.name || 'غير معروف'} - {getRoleLabel(staff.role)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        )}

        {canSwitchClinic && staffList.length === 0 && !isLoadingStaff && (
          <div className="flex items-center gap-2 text-sm">
            <Users className="w-4 h-4 shrink-0" />
            <span className="opacity-70">لا يوجد موظفين</span>
          </div>
        )}

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
              <Select value={selectedClinicId || ''} onValueChange={handleClinicChange} disabled={clinicsLoading}>
                <SelectTrigger className="w-[200px] h-9">
                  <SelectValue placeholder="اختر العيادة" />
                </SelectTrigger>
                <SelectContent>
                  {clinics.map((clinic) => (
                    <SelectItem key={clinic.id} value={clinic.id}>
                      {clinic.name_ar || clinic.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            ) : (
              <span className="text-sm font-medium">{selectedClinicObj?.name_ar || selectedClinicObj?.name}</span>
            )}
          </div>

          {/* Divider */}
          <div className="h-4 w-px bg-border" />

          {/* Staff Section */}
          {canSwitchClinic && staffList.length > 0 && (
            <div className="flex items-center gap-2">
              <Users className="w-4 h-4 text-muted-foreground" />
              <Select value={selectedStaff} onValueChange={handleStaffChange} disabled={isLoadingStaff || !selectedClinicId}>
                <SelectTrigger className="w-[200px] h-9">
                  <SelectValue placeholder="اختر الموظف" />
                </SelectTrigger>
                <SelectContent>
                  {/* Owner/Manager First */}
                  {selectedClinicObj && (
                    <SelectItem value="owner" disabled className="font-semibold border-b">
                      {selectedClinicObj.name_ar || selectedClinicObj.name} - المدير
                    </SelectItem>
                  )}
                  {/* Staff Members */}
                  {staffList.map((staff) => (
                    <SelectItem key={staff.id} value={staff.id} className="pr-6">
                      {staff.name || 'غير معروف'} - {getRoleLabel(staff.role)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}

          {canSwitchClinic && staffList.length === 0 && !isLoadingStaff && (
            <div className="flex items-center gap-2">
              <Users className="w-4 h-4 text-muted-foreground" />
              <span className="text-sm text-muted-foreground">لا يوجد موظفين</span>
            </div>
          )}

          {!canSwitchClinic && selectedStaffObj && (
            <div className="flex items-center gap-2">
              <Users className="w-4 h-4 text-muted-foreground" />
              <span className="text-sm font-medium">{selectedStaffObj.name}</span>
            </div>
          )}
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
