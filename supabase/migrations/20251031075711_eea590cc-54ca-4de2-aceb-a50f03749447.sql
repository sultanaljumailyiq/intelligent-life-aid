-- ============================================
-- ADDITIONAL SYSTEM TABLES
-- ============================================

-- Subscription Payments (enhanced)
CREATE TABLE public.subscription_payments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  payment_number VARCHAR(100) UNIQUE NOT NULL,
  clinic_id UUID REFERENCES public.clinics(id) NOT NULL,
  user_id UUID REFERENCES auth.users(id) NOT NULL,
  subscription_type VARCHAR(100) NOT NULL,
  amount DECIMAL(10, 2) NOT NULL,
  duration INTEGER NOT NULL,
  payment_method VARCHAR(100) NOT NULL,
  status VARCHAR(50) DEFAULT 'pending',
  verification_status VARCHAR(50) DEFAULT 'pending',
  zain_cash_phone_number VARCHAR(20),
  zain_cash_transaction_ref VARCHAR(255),
  sender_name VARCHAR(255),
  exchange_office_name VARCHAR(255),
  deposit_receipt_number VARCHAR(100),
  attachments JSONB DEFAULT '[]'::jsonb,
  verified_by UUID REFERENCES auth.users(id),
  verified_at TIMESTAMP WITH TIME ZONE,
  activated_at TIMESTAMP WITH TIME ZONE,
  expires_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE public.subscription_payments ENABLE ROW LEVEL SECURITY;

-- Community Posts
CREATE TABLE public.community_posts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  author_id UUID REFERENCES auth.users(id) NOT NULL,
  content TEXT NOT NULL,
  images JSONB DEFAULT '[]'::jsonb,
  post_type VARCHAR(50) DEFAULT 'general',
  visibility VARCHAR(50) DEFAULT 'public',
  is_pinned BOOLEAN DEFAULT false,
  is_approved BOOLEAN DEFAULT true,
  like_count INTEGER DEFAULT 0,
  comment_count INTEGER DEFAULT 0,
  share_count INTEGER DEFAULT 0,
  view_count INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE public.community_posts ENABLE ROW LEVEL SECURITY;

-- Community Comments
CREATE TABLE public.community_comments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  post_id UUID REFERENCES public.community_posts(id) ON DELETE CASCADE NOT NULL,
  author_id UUID REFERENCES auth.users(id) NOT NULL,
  parent_comment_id UUID REFERENCES public.community_comments(id),
  content TEXT NOT NULL,
  like_count INTEGER DEFAULT 0,
  is_approved BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE public.community_comments ENABLE ROW LEVEL SECURITY;

-- Community Events
CREATE TABLE public.community_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title VARCHAR(255) NOT NULL,
  arabic_title VARCHAR(255) NOT NULL,
  description TEXT,
  arabic_description TEXT,
  event_type VARCHAR(50) DEFAULT 'webinar',
  is_external BOOLEAN DEFAULT false,
  external_url TEXT,
  meeting_link TEXT,
  start_date TIMESTAMP WITH TIME ZONE NOT NULL,
  end_date TIMESTAMP WITH TIME ZONE NOT NULL,
  duration INTEGER,
  max_attendees INTEGER,
  current_attendees INTEGER DEFAULT 0,
  speaker_name VARCHAR(255),
  speaker_bio TEXT,
  speaker_image TEXT,
  cover_image TEXT,
  tags JSONB DEFAULT '[]'::jsonb,
  price DECIMAL(10, 2) DEFAULT 0.00,
  is_free BOOLEAN DEFAULT true,
  status VARCHAR(50) DEFAULT 'upcoming',
  created_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE public.community_events ENABLE ROW LEVEL SECURITY;

-- Community Educational Content
CREATE TABLE public.community_educational_content (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title VARCHAR(255) NOT NULL,
  arabic_title VARCHAR(255) NOT NULL,
  content TEXT NOT NULL,
  arabic_content TEXT NOT NULL,
  content_type VARCHAR(50) DEFAULT 'article',
  cover_image TEXT,
  images JSONB DEFAULT '[]'::jsonb,
  category VARCHAR(100),
  tags JSONB DEFAULT '[]'::jsonb,
  author_id UUID REFERENCES auth.users(id) NOT NULL,
  status VARCHAR(50) DEFAULT 'pending',
  is_approved BOOLEAN DEFAULT false,
  approved_by UUID REFERENCES auth.users(id),
  approved_at TIMESTAMP WITH TIME ZONE,
  is_pinned BOOLEAN DEFAULT false,
  is_featured BOOLEAN DEFAULT false,
  view_count INTEGER DEFAULT 0,
  like_count INTEGER DEFAULT 0,
  comment_count INTEGER DEFAULT 0,
  published_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE public.community_educational_content ENABLE ROW LEVEL SECURITY;

-- Community Courses
CREATE TABLE public.community_courses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title VARCHAR(255) NOT NULL,
  arabic_title VARCHAR(255) NOT NULL,
  description TEXT,
  arabic_description TEXT,
  instructor VARCHAR(255) NOT NULL,
  cover_image TEXT,
  duration VARCHAR(100),
  level VARCHAR(50) DEFAULT 'beginner',
  price DECIMAL(10, 2) DEFAULT 0.00,
  category VARCHAR(100),
  tags JSONB DEFAULT '[]'::jsonb,
  enrollment_count INTEGER DEFAULT 0,
  rating DECIMAL(3, 2) DEFAULT 0.00,
  review_count INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  is_featured BOOLEAN DEFAULT false,
  start_date TIMESTAMP WITH TIME ZONE,
  end_date TIMESTAMP WITH TIME ZONE,
  created_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE public.community_courses ENABLE ROW LEVEL SECURITY;

-- Jobs Table
CREATE TABLE public.jobs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  employer_id UUID REFERENCES auth.users(id),
  clinic_id UUID REFERENCES public.clinics(id),
  title VARCHAR(255) NOT NULL,
  arabic_title VARCHAR(255) NOT NULL,
  description TEXT NOT NULL,
  arabic_description TEXT NOT NULL,
  job_type VARCHAR(50) NOT NULL,
  location VARCHAR(255),
  governorate VARCHAR(100),
  salary_min DECIMAL(10, 2),
  salary_max DECIMAL(10, 2),
  experience_required INTEGER,
  qualifications JSONB DEFAULT '[]'::jsonb,
  benefits JSONB DEFAULT '[]'::jsonb,
  requirements JSONB DEFAULT '[]'::jsonb,
  status VARCHAR(50) DEFAULT 'open',
  application_deadline TIMESTAMP WITH TIME ZONE,
  application_count INTEGER DEFAULT 0,
  view_count INTEGER DEFAULT 0,
  is_featured BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE public.jobs ENABLE ROW LEVEL SECURITY;

-- Job Applications
CREATE TABLE public.job_applications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  job_id UUID REFERENCES public.jobs(id) ON DELETE CASCADE NOT NULL,
  applicant_id UUID REFERENCES auth.users(id) NOT NULL,
  cover_letter TEXT,
  resume_url TEXT,
  status VARCHAR(50) DEFAULT 'pending',
  reviewed_by UUID REFERENCES auth.users(id),
  reviewed_at TIMESTAMP WITH TIME ZONE,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE public.job_applications ENABLE ROW LEVEL SECURITY;

-- Treatment Plans
CREATE TABLE public.treatment_plans (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  clinic_id UUID REFERENCES public.clinics(id) NOT NULL,
  patient_id UUID REFERENCES public.patients(id) NOT NULL,
  doctor_id UUID REFERENCES auth.users(id) NOT NULL,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  diagnosis TEXT,
  procedures JSONB DEFAULT '[]'::jsonb,
  estimated_cost DECIMAL(10, 2),
  actual_cost DECIMAL(10, 2),
  status VARCHAR(50) DEFAULT 'proposed',
  start_date DATE,
  end_date DATE,
  completed_at TIMESTAMP WITH TIME ZONE,
  notes TEXT,
  attachments JSONB DEFAULT '[]'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE public.treatment_plans ENABLE ROW LEVEL SECURITY;

-- Treatment Procedures
CREATE TABLE public.treatment_procedures (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  treatment_plan_id UUID REFERENCES public.treatment_plans(id) ON DELETE CASCADE NOT NULL,
  procedure_name VARCHAR(255) NOT NULL,
  procedure_code VARCHAR(50),
  description TEXT,
  tooth_number VARCHAR(10),
  cost DECIMAL(10, 2),
  status VARCHAR(50) DEFAULT 'pending',
  scheduled_date DATE,
  completed_date DATE,
  performed_by UUID REFERENCES auth.users(id),
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE public.treatment_procedures ENABLE ROW LEVEL SECURITY;

-- Labs / Dental Laboratories
CREATE TABLE public.labs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id),
  name VARCHAR(255) NOT NULL,
  arabic_name VARCHAR(255) NOT NULL,
  description TEXT,
  arabic_description TEXT,
  email VARCHAR(255),
  phone VARCHAR(50) NOT NULL,
  address TEXT NOT NULL,
  governorate VARCHAR(100) NOT NULL,
  city VARCHAR(100) NOT NULL,
  location_lat DECIMAL(10, 7),
  location_lng DECIMAL(10, 7),
  services JSONB DEFAULT '[]'::jsonb,
  specializations JSONB DEFAULT '[]'::jsonb,
  working_hours JSONB DEFAULT '{}'::jsonb,
  rating DECIMAL(3, 2) DEFAULT 0.00,
  review_count INTEGER DEFAULT 0,
  logo TEXT,
  images JSONB DEFAULT '[]'::jsonb,
  is_verified BOOLEAN DEFAULT false,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE public.labs ENABLE ROW LEVEL SECURITY;

-- Lab Orders
CREATE TABLE public.lab_orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_number VARCHAR(100) UNIQUE NOT NULL,
  clinic_id UUID REFERENCES public.clinics(id) NOT NULL,
  lab_id UUID REFERENCES public.labs(id) NOT NULL,
  patient_id UUID REFERENCES public.patients(id) NOT NULL,
  treatment_plan_id UUID REFERENCES public.treatment_plans(id),
  order_type VARCHAR(100) NOT NULL,
  description TEXT,
  specifications JSONB DEFAULT '{}'::jsonb,
  rush_order BOOLEAN DEFAULT false,
  estimated_cost DECIMAL(10, 2),
  actual_cost DECIMAL(10, 2),
  status VARCHAR(50) DEFAULT 'pending',
  ordered_date DATE NOT NULL,
  expected_date DATE,
  completed_date DATE,
  delivered_date DATE,
  notes TEXT,
  attachments JSONB DEFAULT '[]'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE public.lab_orders ENABLE ROW LEVEL SECURITY;

-- Booking System (for patients to book appointments)
CREATE TABLE public.booking_requests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  clinic_id UUID REFERENCES public.clinics(id) NOT NULL,
  patient_name VARCHAR(255) NOT NULL,
  patient_phone VARCHAR(50) NOT NULL,
  patient_email VARCHAR(255),
  preferred_date DATE NOT NULL,
  preferred_time TIME NOT NULL,
  alternative_dates JSONB DEFAULT '[]'::jsonb,
  treatment_type VARCHAR(100),
  message TEXT,
  status VARCHAR(50) DEFAULT 'pending',
  confirmed_appointment_id UUID REFERENCES public.appointments(id),
  confirmed_by UUID REFERENCES auth.users(id),
  confirmed_at TIMESTAMP WITH TIME ZONE,
  rejection_reason TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE public.booking_requests ENABLE ROW LEVEL SECURITY;

-- Clinic Reviews (for nearby clinic feature)
CREATE TABLE public.clinic_reviews (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  clinic_id UUID REFERENCES public.clinics(id) ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES auth.users(id) NOT NULL,
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  title VARCHAR(255),
  comment TEXT,
  visit_date DATE,
  treatment_received VARCHAR(255),
  recommend BOOLEAN DEFAULT true,
  is_verified BOOLEAN DEFAULT false,
  is_published BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE public.clinic_reviews ENABLE ROW LEVEL SECURITY;

-- Patient Medical Records
CREATE TABLE public.patient_medical_records (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  patient_id UUID REFERENCES public.patients(id) ON DELETE CASCADE NOT NULL,
  clinic_id UUID REFERENCES public.clinics(id) NOT NULL,
  record_type VARCHAR(50) NOT NULL,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  findings TEXT,
  images JSONB DEFAULT '[]'::jsonb,
  documents JSONB DEFAULT '[]'::jsonb,
  recorded_by UUID REFERENCES auth.users(id),
  record_date DATE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE public.patient_medical_records ENABLE ROW LEVEL SECURITY;

-- Triggers
CREATE TRIGGER update_subscription_payments_updated_at
BEFORE UPDATE ON public.subscription_payments
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_community_posts_updated_at
BEFORE UPDATE ON public.community_posts
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_community_comments_updated_at
BEFORE UPDATE ON public.community_comments
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_community_events_updated_at
BEFORE UPDATE ON public.community_events
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_community_educational_content_updated_at
BEFORE UPDATE ON public.community_educational_content
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_community_courses_updated_at
BEFORE UPDATE ON public.community_courses
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_jobs_updated_at
BEFORE UPDATE ON public.jobs
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_job_applications_updated_at
BEFORE UPDATE ON public.job_applications
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_treatment_plans_updated_at
BEFORE UPDATE ON public.treatment_plans
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_treatment_procedures_updated_at
BEFORE UPDATE ON public.treatment_procedures
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_labs_updated_at
BEFORE UPDATE ON public.labs
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_lab_orders_updated_at
BEFORE UPDATE ON public.lab_orders
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_booking_requests_updated_at
BEFORE UPDATE ON public.booking_requests
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_clinic_reviews_updated_at
BEFORE UPDATE ON public.clinic_reviews
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_patient_medical_records_updated_at
BEFORE UPDATE ON public.patient_medical_records
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- RLS Policies

-- Subscription Payments
CREATE POLICY "Users can view their subscription payments"
ON public.subscription_payments FOR SELECT
TO authenticated
USING (user_id = auth.uid());

CREATE POLICY "Clinic owners can view their clinic payments"
ON public.subscription_payments FOR SELECT
TO authenticated
USING (public.is_clinic_owner(auth.uid(), clinic_id));

CREATE POLICY "Platform admins can manage all payments"
ON public.subscription_payments FOR ALL
TO authenticated
USING (public.has_role(auth.uid(), 'platform_admin'));

-- Community Posts
CREATE POLICY "Published posts are viewable by everyone"
ON public.community_posts FOR SELECT
TO authenticated
USING (is_approved = true);

CREATE POLICY "Users can create posts"
ON public.community_posts FOR INSERT
TO authenticated
WITH CHECK (author_id = auth.uid());

CREATE POLICY "Users can update their own posts"
ON public.community_posts FOR UPDATE
TO authenticated
USING (author_id = auth.uid());

CREATE POLICY "Users can delete their own posts"
ON public.community_posts FOR DELETE
TO authenticated
USING (author_id = auth.uid());

-- Community Comments
CREATE POLICY "Approved comments are viewable by everyone"
ON public.community_comments FOR SELECT
TO authenticated
USING (is_approved = true);

CREATE POLICY "Users can create comments"
ON public.community_comments FOR INSERT
TO authenticated
WITH CHECK (author_id = auth.uid());

CREATE POLICY "Users can update their own comments"
ON public.community_comments FOR UPDATE
TO authenticated
USING (author_id = auth.uid());

-- Community Events
CREATE POLICY "Active events are viewable by everyone"
ON public.community_events FOR SELECT
TO authenticated
USING (status IN ('upcoming', 'ongoing'));

CREATE POLICY "Platform admins can manage events"
ON public.community_events FOR ALL
TO authenticated
USING (public.has_role(auth.uid(), 'platform_admin'));

-- Jobs
CREATE POLICY "Active jobs are viewable by everyone"
ON public.jobs FOR SELECT
TO authenticated
USING (status = 'open');

CREATE POLICY "Employers can manage their jobs"
ON public.jobs FOR ALL
TO authenticated
USING (employer_id = auth.uid());

CREATE POLICY "Clinic owners can manage clinic jobs"
ON public.jobs FOR ALL
TO authenticated
USING (public.is_clinic_owner(auth.uid(), clinic_id));

-- Job Applications
CREATE POLICY "Users can view their applications"
ON public.job_applications FOR SELECT
TO authenticated
USING (applicant_id = auth.uid());

CREATE POLICY "Job posters can view applications for their jobs"
ON public.job_applications FOR SELECT
TO authenticated
USING (EXISTS (
  SELECT 1 FROM public.jobs
  WHERE jobs.id = job_applications.job_id
  AND jobs.employer_id = auth.uid()
));

CREATE POLICY "Users can create applications"
ON public.job_applications FOR INSERT
TO authenticated
WITH CHECK (applicant_id = auth.uid());

-- Treatment Plans
CREATE POLICY "Clinic staff can view treatment plans in their clinic"
ON public.treatment_plans FOR SELECT
TO authenticated
USING (public.is_clinic_staff(auth.uid(), clinic_id) OR public.is_clinic_owner(auth.uid(), clinic_id));

CREATE POLICY "Clinic staff can create treatment plans"
ON public.treatment_plans FOR INSERT
TO authenticated
WITH CHECK (public.is_clinic_staff(auth.uid(), clinic_id) OR public.is_clinic_owner(auth.uid(), clinic_id));

CREATE POLICY "Clinic staff can update treatment plans"
ON public.treatment_plans FOR UPDATE
TO authenticated
USING (public.is_clinic_staff(auth.uid(), clinic_id) OR public.is_clinic_owner(auth.uid(), clinic_id));

-- Labs
CREATE POLICY "Active labs are viewable by everyone"
ON public.labs FOR SELECT
TO authenticated
USING (is_active = true);

CREATE POLICY "Lab owners can manage their labs"
ON public.labs FOR ALL
TO authenticated
USING (user_id = auth.uid());

-- Lab Orders
CREATE POLICY "Clinic staff can view their lab orders"
ON public.lab_orders FOR SELECT
TO authenticated
USING (public.is_clinic_staff(auth.uid(), clinic_id) OR public.is_clinic_owner(auth.uid(), clinic_id));

CREATE POLICY "Lab owners can view their orders"
ON public.lab_orders FOR SELECT
TO authenticated
USING (EXISTS (
  SELECT 1 FROM public.labs
  WHERE labs.id = lab_orders.lab_id
  AND labs.user_id = auth.uid()
));

CREATE POLICY "Clinic staff can create lab orders"
ON public.lab_orders FOR INSERT
TO authenticated
WITH CHECK (public.is_clinic_staff(auth.uid(), clinic_id) OR public.is_clinic_owner(auth.uid(), clinic_id));

-- Booking Requests
CREATE POLICY "Clinic staff can view their booking requests"
ON public.booking_requests FOR SELECT
TO authenticated
USING (public.is_clinic_staff(auth.uid(), clinic_id) OR public.is_clinic_owner(auth.uid(), clinic_id));

CREATE POLICY "Anyone can create booking requests"
ON public.booking_requests FOR INSERT
TO authenticated
WITH CHECK (true);

CREATE POLICY "Clinic staff can update booking requests"
ON public.booking_requests FOR UPDATE
TO authenticated
USING (public.is_clinic_staff(auth.uid(), clinic_id) OR public.is_clinic_owner(auth.uid(), clinic_id));

-- Clinic Reviews
CREATE POLICY "Published reviews are viewable by everyone"
ON public.clinic_reviews FOR SELECT
TO authenticated
USING (is_published = true);

CREATE POLICY "Users can create reviews"
ON public.clinic_reviews FOR INSERT
TO authenticated
WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can update their own reviews"
ON public.clinic_reviews FOR UPDATE
TO authenticated
USING (user_id = auth.uid());

-- Patient Medical Records
CREATE POLICY "Clinic staff can view patient records"
ON public.patient_medical_records FOR SELECT
TO authenticated
USING (public.is_clinic_staff(auth.uid(), clinic_id) OR public.is_clinic_owner(auth.uid(), clinic_id));

CREATE POLICY "Clinic staff can create records"
ON public.patient_medical_records FOR INSERT
TO authenticated
WITH CHECK (public.is_clinic_staff(auth.uid(), clinic_id) OR public.is_clinic_owner(auth.uid(), clinic_id));

CREATE POLICY "Clinic staff can update records"
ON public.patient_medical_records FOR UPDATE
TO authenticated
USING (public.is_clinic_staff(auth.uid(), clinic_id) OR public.is_clinic_owner(auth.uid(), clinic_id));

-- Indexes
CREATE INDEX idx_subscription_payments_clinic ON public.subscription_payments(clinic_id);
CREATE INDEX idx_subscription_payments_user ON public.subscription_payments(user_id);
CREATE INDEX idx_community_posts_author ON public.community_posts(author_id);
CREATE INDEX idx_community_comments_post ON public.community_comments(post_id);
CREATE INDEX idx_jobs_clinic ON public.jobs(clinic_id);
CREATE INDEX idx_job_applications_job ON public.job_applications(job_id);
CREATE INDEX idx_treatment_plans_patient ON public.treatment_plans(patient_id);
CREATE INDEX idx_treatment_plans_clinic ON public.treatment_plans(clinic_id);
CREATE INDEX idx_labs_governorate ON public.labs(governorate);
CREATE INDEX idx_lab_orders_clinic ON public.lab_orders(clinic_id);
CREATE INDEX idx_lab_orders_lab ON public.lab_orders(lab_id);
CREATE INDEX idx_booking_requests_clinic ON public.booking_requests(clinic_id);
CREATE INDEX idx_clinic_reviews_clinic ON public.clinic_reviews(clinic_id);
CREATE INDEX idx_patient_medical_records_patient ON public.patient_medical_records(patient_id);