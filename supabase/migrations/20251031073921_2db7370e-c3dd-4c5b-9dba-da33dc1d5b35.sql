-- Create app_role enum for user roles
CREATE TYPE public.app_role AS ENUM ('platform_admin', 'dentist', 'clinic_manager', 'nurse', 'assistant', 'receptionist');

-- Create user_roles table (CRITICAL: Separate from profiles for security)
CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  role public.app_role NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE (user_id, role)
);

ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- Create profiles table for user information
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT NOT NULL,
  email TEXT,
  phone TEXT,
  avatar_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Create clinics table
CREATE TABLE public.clinics (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  owner_id UUID REFERENCES auth.users(id) NOT NULL,
  name TEXT NOT NULL,
  name_ar TEXT NOT NULL,
  address TEXT,
  city TEXT,
  phone TEXT,
  email TEXT,
  logo_url TEXT,
  online_booking_enabled BOOLEAN DEFAULT false,
  working_hours JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE public.clinics ENABLE ROW LEVEL SECURITY;

-- Create clinic_staff table
CREATE TABLE public.clinic_staff (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  clinic_id UUID REFERENCES public.clinics(id) ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  role public.app_role NOT NULL,
  permissions JSONB DEFAULT '{"can_view_patients": true, "can_edit_patients": false, "can_view_appointments": true, "can_edit_appointments": false}'::jsonb,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE (clinic_id, user_id)
);

ALTER TABLE public.clinic_staff ENABLE ROW LEVEL SECURITY;

-- Create patients table
CREATE TABLE public.patients (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  clinic_id UUID REFERENCES public.clinics(id) ON DELETE CASCADE NOT NULL,
  name TEXT NOT NULL,
  phone TEXT NOT NULL,
  email TEXT,
  date_of_birth DATE,
  gender TEXT CHECK (gender IN ('male', 'female')),
  address TEXT,
  medical_history JSONB DEFAULT '{}'::jsonb,
  notes TEXT,
  created_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE public.patients ENABLE ROW LEVEL SECURITY;

-- Create appointments table
CREATE TABLE public.appointments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  clinic_id UUID REFERENCES public.clinics(id) ON DELETE CASCADE NOT NULL,
  patient_id UUID REFERENCES public.patients(id) ON DELETE CASCADE NOT NULL,
  doctor_id UUID REFERENCES auth.users(id) NOT NULL,
  appointment_date DATE NOT NULL,
  appointment_time TIME NOT NULL,
  duration INTEGER DEFAULT 30,
  treatment TEXT,
  status TEXT DEFAULT 'scheduled' CHECK (status IN ('scheduled', 'confirmed', 'completed', 'cancelled', 'no_show')),
  notes TEXT,
  created_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE public.appointments ENABLE ROW LEVEL SECURITY;

-- Create notifications table
CREATE TABLE public.notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  clinic_id UUID REFERENCES public.clinics(id) ON DELETE CASCADE,
  type TEXT NOT NULL CHECK (type IN ('new_patient', 'new_appointment', 'appointment_reminder', 'task_assigned', 'low_stock', 'general')),
  title TEXT NOT NULL,
  message TEXT,
  related_id UUID,
  related_type TEXT,
  is_read BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;

-- Create staff_tasks table
CREATE TABLE public.staff_tasks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  clinic_id UUID REFERENCES public.clinics(id) ON DELETE CASCADE NOT NULL,
  from_staff_id UUID REFERENCES auth.users(id) NOT NULL,
  to_staff_id UUID REFERENCES auth.users(id) NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  priority TEXT DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high', 'urgent')),
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'in_progress', 'completed', 'cancelled')),
  due_date TIMESTAMP WITH TIME ZONE,
  completed_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE public.staff_tasks ENABLE ROW LEVEL SECURITY;

-- Create staff_reminders table
CREATE TABLE public.staff_reminders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  clinic_id UUID REFERENCES public.clinics(id) ON DELETE CASCADE NOT NULL,
  staff_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  reminder_time TIMESTAMP WITH TIME ZONE NOT NULL,
  reminder_type TEXT CHECK (reminder_type IN ('appointment', 'task', 'meeting', 'general')),
  related_id UUID,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'sent', 'dismissed')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE public.staff_reminders ENABLE ROW LEVEL SECURITY;

-- Create security definer function to check user role
CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role public.app_role)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id
      AND role = _role
  )
$$;

-- Create security definer function to check if user is clinic staff
CREATE OR REPLACE FUNCTION public.is_clinic_staff(_user_id UUID, _clinic_id UUID)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.clinic_staff
    WHERE user_id = _user_id
      AND clinic_id = _clinic_id
      AND is_active = true
  )
$$;

-- Create security definer function to check if user is clinic owner
CREATE OR REPLACE FUNCTION public.is_clinic_owner(_user_id UUID, _clinic_id UUID)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.clinics
    WHERE id = _clinic_id
      AND owner_id = _user_id
  )
$$;

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$;

-- Create trigger for profiles
CREATE TRIGGER update_profiles_updated_at
BEFORE UPDATE ON public.profiles
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Create trigger for clinics
CREATE TRIGGER update_clinics_updated_at
BEFORE UPDATE ON public.clinics
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Create trigger for clinic_staff
CREATE TRIGGER update_clinic_staff_updated_at
BEFORE UPDATE ON public.clinic_staff
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Create trigger for patients
CREATE TRIGGER update_patients_updated_at
BEFORE UPDATE ON public.patients
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Create trigger for appointments
CREATE TRIGGER update_appointments_updated_at
BEFORE UPDATE ON public.appointments
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Create trigger for staff_tasks
CREATE TRIGGER update_staff_tasks_updated_at
BEFORE UPDATE ON public.staff_tasks
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Function to handle new user creation
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, email, phone)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'full_name', 'User'),
    NEW.email,
    NEW.raw_user_meta_data->>'phone'
  );
  RETURN NEW;
END;
$$;

-- Trigger to create profile on user signup
CREATE TRIGGER on_auth_user_created
AFTER INSERT ON auth.users
FOR EACH ROW
EXECUTE FUNCTION public.handle_new_user();

-- RLS Policies for user_roles
CREATE POLICY "Users can view their own roles"
ON public.user_roles FOR SELECT
TO authenticated
USING (user_id = auth.uid());

CREATE POLICY "Platform admins can manage all roles"
ON public.user_roles FOR ALL
TO authenticated
USING (public.has_role(auth.uid(), 'platform_admin'));

-- RLS Policies for profiles
CREATE POLICY "Users can view their own profile"
ON public.profiles FOR SELECT
TO authenticated
USING (id = auth.uid());

CREATE POLICY "Users can update their own profile"
ON public.profiles FOR UPDATE
TO authenticated
USING (id = auth.uid());

CREATE POLICY "Platform admins can view all profiles"
ON public.profiles FOR SELECT
TO authenticated
USING (public.has_role(auth.uid(), 'platform_admin'));

-- RLS Policies for clinics
CREATE POLICY "Platform admins can view all clinics"
ON public.clinics FOR SELECT
TO authenticated
USING (public.has_role(auth.uid(), 'platform_admin'));

CREATE POLICY "Clinic owners can view their clinics"
ON public.clinics FOR SELECT
TO authenticated
USING (owner_id = auth.uid());

CREATE POLICY "Clinic staff can view their clinics"
ON public.clinics FOR SELECT
TO authenticated
USING (public.is_clinic_staff(auth.uid(), id));

CREATE POLICY "Platform admins can insert clinics"
ON public.clinics FOR INSERT
TO authenticated
WITH CHECK (public.has_role(auth.uid(), 'platform_admin'));

CREATE POLICY "Dentists can create clinics"
ON public.clinics FOR INSERT
TO authenticated
WITH CHECK (public.has_role(auth.uid(), 'dentist') AND owner_id = auth.uid());

CREATE POLICY "Clinic owners can update their clinics"
ON public.clinics FOR UPDATE
TO authenticated
USING (owner_id = auth.uid());

CREATE POLICY "Platform admins can delete clinics"
ON public.clinics FOR DELETE
TO authenticated
USING (public.has_role(auth.uid(), 'platform_admin'));

-- RLS Policies for clinic_staff
CREATE POLICY "Clinic staff can view their clinic staff"
ON public.clinic_staff FOR SELECT
TO authenticated
USING (public.is_clinic_staff(auth.uid(), clinic_id) OR public.is_clinic_owner(auth.uid(), clinic_id));

CREATE POLICY "Clinic owners can manage staff"
ON public.clinic_staff FOR ALL
TO authenticated
USING (public.is_clinic_owner(auth.uid(), clinic_id));

CREATE POLICY "Platform admins can manage all staff"
ON public.clinic_staff FOR ALL
TO authenticated
USING (public.has_role(auth.uid(), 'platform_admin'));

-- RLS Policies for patients
CREATE POLICY "Clinic staff can view patients in their clinic"
ON public.patients FOR SELECT
TO authenticated
USING (public.is_clinic_staff(auth.uid(), clinic_id) OR public.is_clinic_owner(auth.uid(), clinic_id));

CREATE POLICY "Clinic staff can insert patients"
ON public.patients FOR INSERT
TO authenticated
WITH CHECK (public.is_clinic_staff(auth.uid(), clinic_id) OR public.is_clinic_owner(auth.uid(), clinic_id));

CREATE POLICY "Clinic staff can update patients"
ON public.patients FOR UPDATE
TO authenticated
USING (public.is_clinic_staff(auth.uid(), clinic_id) OR public.is_clinic_owner(auth.uid(), clinic_id));

CREATE POLICY "Platform admins can manage all patients"
ON public.patients FOR ALL
TO authenticated
USING (public.has_role(auth.uid(), 'platform_admin'));

-- RLS Policies for appointments
CREATE POLICY "Clinic staff can view appointments in their clinic"
ON public.appointments FOR SELECT
TO authenticated
USING (public.is_clinic_staff(auth.uid(), clinic_id) OR public.is_clinic_owner(auth.uid(), clinic_id));

CREATE POLICY "Clinic staff can insert appointments"
ON public.appointments FOR INSERT
TO authenticated
WITH CHECK (public.is_clinic_staff(auth.uid(), clinic_id) OR public.is_clinic_owner(auth.uid(), clinic_id));

CREATE POLICY "Clinic staff can update appointments"
ON public.appointments FOR UPDATE
TO authenticated
USING (public.is_clinic_staff(auth.uid(), clinic_id) OR public.is_clinic_owner(auth.uid(), clinic_id));

CREATE POLICY "Clinic staff can delete appointments"
ON public.appointments FOR DELETE
TO authenticated
USING (public.is_clinic_staff(auth.uid(), clinic_id) OR public.is_clinic_owner(auth.uid(), clinic_id));

CREATE POLICY "Platform admins can manage all appointments"
ON public.appointments FOR ALL
TO authenticated
USING (public.has_role(auth.uid(), 'platform_admin'));

-- RLS Policies for notifications
CREATE POLICY "Users can view their own notifications"
ON public.notifications FOR SELECT
TO authenticated
USING (user_id = auth.uid());

CREATE POLICY "Users can update their own notifications"
ON public.notifications FOR UPDATE
TO authenticated
USING (user_id = auth.uid());

CREATE POLICY "Clinic staff can create notifications for clinic users"
ON public.notifications FOR INSERT
TO authenticated
WITH CHECK (
  clinic_id IS NULL OR 
  public.is_clinic_staff(auth.uid(), clinic_id) OR 
  public.is_clinic_owner(auth.uid(), clinic_id)
);

-- RLS Policies for staff_tasks
CREATE POLICY "Staff can view tasks assigned to or from them"
ON public.staff_tasks FOR SELECT
TO authenticated
USING (from_staff_id = auth.uid() OR to_staff_id = auth.uid());

CREATE POLICY "Staff can create tasks in their clinic"
ON public.staff_tasks FOR INSERT
TO authenticated
WITH CHECK (
  public.is_clinic_staff(auth.uid(), clinic_id) AND from_staff_id = auth.uid()
);

CREATE POLICY "Staff can update their tasks"
ON public.staff_tasks FOR UPDATE
TO authenticated
USING (from_staff_id = auth.uid() OR to_staff_id = auth.uid());

CREATE POLICY "Platform admins can manage all tasks"
ON public.staff_tasks FOR ALL
TO authenticated
USING (public.has_role(auth.uid(), 'platform_admin'));

-- RLS Policies for staff_reminders
CREATE POLICY "Staff can view their own reminders"
ON public.staff_reminders FOR SELECT
TO authenticated
USING (staff_id = auth.uid());

CREATE POLICY "Staff can create their own reminders"
ON public.staff_reminders FOR INSERT
TO authenticated
WITH CHECK (staff_id = auth.uid() AND public.is_clinic_staff(auth.uid(), clinic_id));

CREATE POLICY "Staff can update their own reminders"
ON public.staff_reminders FOR UPDATE
TO authenticated
USING (staff_id = auth.uid());

CREATE POLICY "Staff can delete their own reminders"
ON public.staff_reminders FOR DELETE
TO authenticated
USING (staff_id = auth.uid());

-- Create indexes for better performance
CREATE INDEX idx_user_roles_user_id ON public.user_roles(user_id);
CREATE INDEX idx_clinic_staff_user_id ON public.clinic_staff(user_id);
CREATE INDEX idx_clinic_staff_clinic_id ON public.clinic_staff(clinic_id);
CREATE INDEX idx_patients_clinic_id ON public.patients(clinic_id);
CREATE INDEX idx_appointments_clinic_id ON public.appointments(clinic_id);
CREATE INDEX idx_appointments_patient_id ON public.appointments(patient_id);
CREATE INDEX idx_appointments_doctor_id ON public.appointments(doctor_id);
CREATE INDEX idx_appointments_date ON public.appointments(appointment_date);
CREATE INDEX idx_notifications_user_id ON public.notifications(user_id);
CREATE INDEX idx_notifications_is_read ON public.notifications(is_read);
CREATE INDEX idx_staff_tasks_to_staff ON public.staff_tasks(to_staff_id);
CREATE INDEX idx_staff_tasks_from_staff ON public.staff_tasks(from_staff_id);
CREATE INDEX idx_staff_reminders_staff_id ON public.staff_reminders(staff_id);
CREATE INDEX idx_staff_reminders_time ON public.staff_reminders(reminder_time);