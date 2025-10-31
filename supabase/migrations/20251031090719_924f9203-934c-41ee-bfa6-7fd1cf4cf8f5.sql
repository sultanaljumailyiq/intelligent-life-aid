
-- Create demo profiles (these will be linked when users register)
-- Note: These won't work without actual auth.users entries
-- We'll create a function to set up demo data when a user registers

-- Create a function to setup demo clinic and staff for new dentist users
CREATE OR REPLACE FUNCTION setup_demo_clinic_for_dentist()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  demo_clinic_id uuid;
  demo_staff_id_1 uuid;
  demo_staff_id_2 uuid;
BEGIN
  -- Only setup demo data for dentists with demo email
  IF NEW.email = 'demo@clinic.com' THEN
    -- Create demo profiles for staff (if they don't exist)
    INSERT INTO profiles (id, full_name, email, phone)
    VALUES 
      ('33333333-3333-3333-3333-333333333333', 'محمد حسن', 'mohammed@demo.com', '07701234569'),
      ('44444444-4444-4444-4444-444444444444', 'فاطمة عبدالله', 'fatima@demo.com', '07701234570')
    ON CONFLICT (id) DO NOTHING;

    -- Create a demo clinic for this user
    INSERT INTO clinics (id, name, name_ar, owner_id, address, city, phone, email, online_booking_enabled)
    VALUES (
      'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa',
      'Demo Dental Clinic',
      'عيادة الأسنان التجريبية',
      NEW.id,
      'شارع الكرادة، بغداد',
      'بغداد',
      '07701234567',
      'demo@clinic.com',
      true
    )
    ON CONFLICT (id) DO UPDATE SET owner_id = NEW.id;

    -- Add demo staff to the clinic
    INSERT INTO clinic_staff (clinic_id, user_id, role, is_active)
    VALUES 
      ('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', '33333333-3333-3333-3333-333333333333', 'manager', true),
      ('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', '44444444-4444-4444-4444-444444444444', 'receptionist', true)
    ON CONFLICT (clinic_id, user_id, role) DO NOTHING;

    -- Create clinic settings
    INSERT INTO clinic_settings (clinic_id, booking_enabled, appointment_duration_default)
    VALUES ('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', true, 30)
    ON CONFLICT (clinic_id) DO NOTHING;
  END IF;

  RETURN NEW;
END;
$$;

-- Create trigger to setup demo clinic after profile is created
DROP TRIGGER IF EXISTS on_profile_created_setup_demo ON profiles;
CREATE TRIGGER on_profile_created_setup_demo
  AFTER INSERT ON profiles
  FOR EACH ROW
  EXECUTE FUNCTION setup_demo_clinic_for_dentist();
