import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Calendar, UserPlus, BarChart3, Package, DollarSign, Settings, Stethoscope, Users, Building2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useClinic } from "@/contexts/ClinicContext";
import AddPatientDialog from "./modals/AddPatientDialog";
import AddReservationDialog from "./modals/AddReservationDialog";

export default function ClinicQuickActionsBar() {
  const navigate = useNavigate();
  const { selectedClinicId } = useClinic();
  const [openPatient, setOpenPatient] = useState(false);
  const [openReservation, setOpenReservation] = useState(false);

  const go = (path: string) => {
    const query = selectedClinicId ? `?clinicId=${encodeURIComponent(selectedClinicId)}` : "";
    navigate(`${path}${query}`);
  };

  const items = [
    { id: "new_appointment", label: "موعد جديد", icon: Calendar, onClick: () => setOpenReservation(true) },
    { id: "new_patient", label: "مريض جديد", icon: UserPlus, onClick: () => setOpenPatient(true) },
    { id: "reports", label: "التقارير", icon: BarChart3, path: "/clinic_old/reports" },
    { id: "stocks", label: "المخزون", icon: Package, path: "/clinic_old/stocks" },
    { id: "finance", label: "المالية", icon: DollarSign, path: "/clinic_old/finance" },
    { id: "settings", label: "الإعدادات", icon: Settings, path: "/clinic_old/peripherals" },
    { id: "treatments", label: "العلاجات", icon: Stethoscope, path: "/clinic_old/treatments" },
    { id: "staff", label: "الطاقم الطبي", icon: Users, path: "/clinic_old/staff" },
    { id: "lab", label: "المختبر", icon: Building2, path: "/clinic_old/lab" },
  ];

  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {items.map((item) => {
          const Icon = item.icon;
          const onClick = item.onClick || (() => item.path && go(item.path!));
          return (
            <button
              key={item.id}
              onClick={onClick}
              className={cn("flex items-center gap-4 p-4 rounded-2xl transition-all group bg-card hover:bg-muted")}
            >
              <div className="w-12 h-12 rounded-xl flex items-center justify-center bg-primary text-primary-foreground group-hover:scale-110 transition-transform">
                <Icon className="w-6 h-6" />
              </div>
              <div className="text-right">
                <p className="font-medium">{item.label}</p>
                <p className="text-xs opacity-70">إجراء سريع</p>
              </div>
            </button>
          );
        })}
      </div>

      <AddPatientDialog open={openPatient} onOpenChange={setOpenPatient} clinicId={selectedClinicId} />
      <AddReservationDialog open={openReservation} onOpenChange={setOpenReservation} clinicId={selectedClinicId} />
    </>
  );
}
