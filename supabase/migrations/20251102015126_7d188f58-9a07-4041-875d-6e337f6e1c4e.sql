-- Create trigger to set up demo data when demo user signs up
-- This ensures complete demo environment is ready automatically

CREATE OR REPLACE FUNCTION public.setup_demo_user_data()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Only run for demo user
  IF NEW.email = 'demo@clinic.com' THEN
    
    -- Create profile
    INSERT INTO profiles (id, full_name, email, phone)
    VALUES (
      NEW.id,
      'د. أحمد محمد',
      'demo@clinic.com',
      '07901234567'
    )
    ON CONFLICT (id) DO NOTHING;

    -- Assign dentist role
    INSERT INTO user_roles (user_id, role)
    VALUES (NEW.id, 'dentist')
    ON CONFLICT (user_id, role) DO NOTHING;

    -- Create first demo clinic
    INSERT INTO clinics (id, name, name_ar, owner_id, address, city, phone, email, online_booking_enabled)
    VALUES (
      gen_random_uuid(),
      'Demo Dental Clinic',
      'عيادة الأسنان التجريبية',
      NEW.id,
      'شارع الرشيد، بناية 15',
      'بغداد',
      '07701234567',
      'clinic@demo.com',
      true
    );

    -- Create second demo clinic
    INSERT INTO clinics (id, name, name_ar, owner_id, address, city, phone, email, online_booking_enabled)
    VALUES (
      gen_random_uuid(),
      'Advanced Dental Center',
      'مركز الأسنان المتقدم',
      NEW.id,
      'شارع الكرادة، بناية 42',
      'بغداد',
      '07702345678',
      'advanced@demo.com',
      true
    );

    -- Note: Staff will be added manually as they need their own auth.users entries
    
  END IF;
  
  RETURN NEW;
END;
$$;

-- Drop existing trigger if exists
DROP TRIGGER IF EXISTS on_auth_user_created_setup_demo ON auth.users;

-- Create trigger
CREATE TRIGGER on_auth_user_created_setup_demo
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.setup_demo_user_data();