-- Create simple trigger to set up demo data when demo user signs up
CREATE OR REPLACE FUNCTION public.setup_demo_on_signup()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Only run for demo user
  IF NEW.email = 'demo@clinic.com' THEN
    
    -- Create or update profile
    INSERT INTO profiles (id, full_name, email, phone)
    VALUES (
      NEW.id,
      'د. أحمد محمد',
      'demo@clinic.com',
      '07901234567'
    )
    ON CONFLICT (id) DO UPDATE
    SET full_name = EXCLUDED.full_name,
        email = EXCLUDED.email,
        phone = EXCLUDED.phone;

    -- Assign dentist role
    INSERT INTO user_roles (user_id, role)
    VALUES (NEW.id, 'dentist')
    ON CONFLICT (user_id, role) DO NOTHING;

    -- Create first demo clinic
    INSERT INTO clinics (name, name_ar, owner_id, address, city, phone, email, online_booking_enabled)
    VALUES (
      'Demo Dental Clinic',
      'عيادة الأسنان التجريبية',
      NEW.id,
      'شارع الرشيد، بناية 15',
      'بغداد',
      '07701234567',
      'clinic1@demo.com',
      true
    )
    ON CONFLICT DO NOTHING;

    -- Create second demo clinic
    INSERT INTO clinics (name, name_ar, owner_id, address, city, phone, email, online_booking_enabled)
    VALUES (
      'Advanced Dental Center',
      'مركز الأسنان المتقدم',
      NEW.id,
      'شارع الكرادة، بناية 42',
      'بغداد',
      '07702345678',
      'clinic2@demo.com',
      true
    )
    ON CONFLICT DO NOTHING;
    
  END IF;
  
  RETURN NEW;
END;
$$;

-- Drop old trigger if exists
DROP TRIGGER IF EXISTS on_demo_user_signup ON auth.users;

-- Create new trigger
CREATE TRIGGER on_demo_user_signup
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.setup_demo_on_signup();