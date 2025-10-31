import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { ClinicService, type ClinicData } from "@/services/clinicService";

interface ClinicContextType {
  selectedClinicId: string | null;
  setSelectedClinicId: (id: string | null) => void;
  clinics: ClinicData[];
  selectedClinic: ClinicData | null;
  loading: boolean;
  refreshClinics: () => Promise<void>;
}

const ClinicContext = createContext<ClinicContextType | undefined>(undefined);

export const ClinicProvider = ({ children }: { children: ReactNode }) => {
  const [selectedClinicId, setSelectedClinicId] = useState<string | null>(null);
  const [clinics, setClinics] = useState<ClinicData[]>([]);
  const [loading, setLoading] = useState(true);

  const loadClinics = async () => {
    try {
      setLoading(true);
      const data = await ClinicService.getUserClinics();
      setClinics(data);
      
      // Auto-select first clinic if available and none selected
      if (data.length > 0 && !selectedClinicId) {
        setSelectedClinicId(data[0].id);
      }
      
      // If selected clinic is no longer available, select first one
      if (selectedClinicId && !data.find(c => c.id === selectedClinicId)) {
        setSelectedClinicId(data.length > 0 ? data[0].id : null);
      }
    } catch (error) {
      console.error('Error loading clinics:', error);
      setClinics([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadClinics();
  }, []);

  const selectedClinic = selectedClinicId 
    ? clinics.find(c => c.id === selectedClinicId) || null 
    : null;

  return (
    <ClinicContext.Provider value={{ 
      selectedClinicId, 
      setSelectedClinicId, 
      clinics, 
      selectedClinic,
      loading,
      refreshClinics: loadClinics
    }}>
      {children}
    </ClinicContext.Provider>
  );
};

export const useClinic = () => {
  const context = useContext(ClinicContext);
  if (context === undefined) {
    throw new Error("useClinic must be used within a ClinicProvider");
  }
  return context;
};
