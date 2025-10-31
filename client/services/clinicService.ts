import { supabase } from "../../src/integrations/supabase/client";

export interface ClinicData {
  id: string;
  name: string;
  name_ar: string;
  address: string | null;
  city: string | null;
  phone: string | null;
  email: string | null;
  logo_url: string | null;
  owner_id: string;
  online_booking_enabled: boolean;
  working_hours: any;
  created_at: string;
  updated_at: string;
}

export interface StaffMember {
  id: string;
  user_id: string;
  clinic_id: string;
  role: string;
  permissions: any;
  is_active: boolean;
  created_at: string;
  name?: string;
  email?: string;
  phone?: string;
}

export const ClinicService = {
  // Get all clinics for the current user (owner or staff)
  async getUserClinics(): Promise<ClinicData[]> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return [];

    // Get clinics where user is owner
    const { data: ownedClinics, error: ownerError } = await supabase
      .from('clinics')
      .select('*')
      .eq('owner_id', user.id);

    if (ownerError) {
      console.error('Error fetching owned clinics:', ownerError);
      return [];
    }

    // Get clinics where user is staff
    const { data: staffClinics, error: staffError } = await supabase
      .from('clinic_staff')
      .select('clinic_id, clinics(*)')
      .eq('user_id', user.id)
      .eq('is_active', true);

    if (staffError) {
      console.error('Error fetching staff clinics:', staffError);
      return ownedClinics || [];
    }

    // Combine and deduplicate
    const allClinics = [
      ...(ownedClinics || []),
      ...(staffClinics?.map((sc: any) => sc.clinics).filter(Boolean) || [])
    ];

    // Remove duplicates by id
    const uniqueClinics = Array.from(
      new Map(allClinics.map(c => [c.id, c])).values()
    );

    return uniqueClinics as ClinicData[];
  },

  // Get clinic by ID
  async getClinicById(clinicId: string): Promise<ClinicData | null> {
    const { data, error } = await supabase
      .from('clinics')
      .select('*')
      .eq('id', clinicId)
      .single();

    if (error) {
      console.error('Error fetching clinic:', error);
      return null;
    }

    return data;
  },

  // Get clinic by identifier (for booking pages)
  async getClinicByIdentifier(identifier: string): Promise<ClinicData | null> {
    const { data, error } = await supabase
      .from('clinics')
      .select('*')
      .eq('id', identifier)
      .single();

    if (error) {
      console.error('Error fetching clinic by identifier:', error);
      return null;
    }

    return data;
  },

  // Get clinics by owner ID
  async getDoctorClinics(ownerId: string): Promise<ClinicData[]> {
    const { data, error } = await supabase
      .from('clinics')
      .select('*')
      .eq('owner_id', ownerId);

    if (error) {
      console.error('Error fetching doctor clinics:', error);
      return [];
    }

    return data || [];
  },

  // Get staff members for a clinic
  async getClinicStaff(clinicId: string): Promise<StaffMember[]> {
    const { data, error } = await supabase
      .from('clinic_staff')
      .select(`
        *,
        profiles:user_id (
          full_name,
          email,
          phone
        )
      `)
      .eq('clinic_id', clinicId)
      .eq('is_active', true);

    if (error) {
      console.error('Error fetching clinic staff:', error);
      return [];
    }

    // Map the data to include profile information
    return (data || []).map((staff: any) => ({
      ...staff,
      name: staff.profiles?.full_name || staff.profiles?.email || 'موظف',
      email: staff.profiles?.email,
      phone: staff.profiles?.phone,
    }));
  },

  // Check if user is clinic owner
  async isClinicOwner(clinicId: string): Promise<boolean> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return false;

    const { data, error } = await supabase
      .from('clinics')
      .select('owner_id')
      .eq('id', clinicId)
      .single();

    if (error) return false;
    return data?.owner_id === user.id;
  },

  // Check if user is staff member of clinic
  async isClinicStaff(clinicId: string): Promise<boolean> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return false;

    const { data, error } = await supabase
      .from('clinic_staff')
      .select('id')
      .eq('clinic_id', clinicId)
      .eq('user_id', user.id)
      .eq('is_active', true)
      .single();

    if (error) return false;
    return !!data;
  },

  // Get user's role in a clinic (owner or staff role)
  async getUserRoleInClinic(clinicId: string): Promise<string | null> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return null;

    // Check if owner
    const isOwner = await this.isClinicOwner(clinicId);
    if (isOwner) return 'owner';

    // Check staff role
    const { data, error } = await supabase
      .from('clinic_staff')
      .select('role')
      .eq('clinic_id', clinicId)
      .eq('user_id', user.id)
      .eq('is_active', true)
      .single();

    if (error) return null;
    return data?.role || null;
  },

  // Book an appointment (create booking request)
  async bookAppointment(appointmentData: {
    clinicId: string;
    patientName: string;
    patientPhone: string;
    patientEmail?: string;
    appointmentDate: string;
    appointmentTime: string;
    service: string;
    notes?: string;
    status?: string;
  }): Promise<any> {
    const { data, error } = await supabase
      .from('booking_requests')
      .insert({
        clinic_id: appointmentData.clinicId,
        patient_name: appointmentData.patientName,
        patient_phone: appointmentData.patientPhone,
        patient_email: appointmentData.patientEmail || null,
        preferred_date: appointmentData.appointmentDate,
        preferred_time: appointmentData.appointmentTime,
        treatment_type: appointmentData.service,
        message: appointmentData.notes || null,
        status: appointmentData.status || 'pending'
      })
      .select()
      .single();

    if (error) {
      console.error('Error booking appointment:', error);
      throw error;
    }

    return data;
  }
};
