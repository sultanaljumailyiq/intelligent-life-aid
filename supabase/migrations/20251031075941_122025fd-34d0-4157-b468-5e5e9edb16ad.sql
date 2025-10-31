-- ============================================
-- MISSING ESSENTIAL TABLES
-- ============================================

-- Subscription Plans
CREATE TABLE public.subscription_plans (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  arabic_name VARCHAR(255) NOT NULL,
  description TEXT,
  arabic_description TEXT,
  price DECIMAL(10, 2) NOT NULL,
  duration_months INTEGER NOT NULL,
  features JSONB DEFAULT '[]'::jsonb,
  arabic_features JSONB DEFAULT '[]'::jsonb,
  can_be_promoted BOOLEAN DEFAULT false,
  max_priority_level INTEGER DEFAULT 0,
  show_in_top BOOLEAN DEFAULT false,
  max_monthly_appearances INTEGER,
  is_active BOOLEAN DEFAULT true,
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE public.subscription_plans ENABLE ROW LEVEL SECURITY;

-- Conversations (for clinic-patient, clinic-staff communication)
CREATE TABLE public.conversations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  conversation_type VARCHAR(50) NOT NULL CHECK (conversation_type IN ('clinic_patient', 'clinic_staff', 'staff_staff', 'direct')),
  clinic_id UUID REFERENCES public.clinics(id) ON DELETE CASCADE,
  patient_id UUID REFERENCES public.patients(id) ON DELETE CASCADE,
  participant_ids JSONB DEFAULT '[]'::jsonb,
  title VARCHAR(255),
  last_message_at TIMESTAMP WITH TIME ZONE,
  last_message_preview TEXT,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE public.conversations ENABLE ROW LEVEL SECURITY;

-- Messages (for conversations)
CREATE TABLE public.messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  conversation_id UUID REFERENCES public.conversations(id) ON DELETE CASCADE NOT NULL,
  sender_id UUID REFERENCES auth.users(id) NOT NULL,
  sender_type VARCHAR(50) NOT NULL CHECK (sender_type IN ('staff', 'patient', 'admin')),
  content TEXT NOT NULL,
  attachments JSONB DEFAULT '[]'::jsonb,
  is_read BOOLEAN DEFAULT false,
  read_at TIMESTAMP WITH TIME ZONE,
  read_by JSONB DEFAULT '[]'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;

-- Community Post Likes
CREATE TABLE public.community_post_likes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  post_id UUID REFERENCES public.community_posts(id) ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(post_id, user_id)
);

ALTER TABLE public.community_post_likes ENABLE ROW LEVEL SECURITY;

-- Review Helpful (for marking reviews as helpful)
CREATE TABLE public.review_helpful (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  review_id UUID REFERENCES public.reviews(id) ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  is_helpful BOOLEAN NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(review_id, user_id)
);

ALTER TABLE public.review_helpful ENABLE ROW LEVEL SECURITY;

-- Clinic Review Helpful (for clinic reviews)
CREATE TABLE public.clinic_review_helpful (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  review_id UUID REFERENCES public.clinic_reviews(id) ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  is_helpful BOOLEAN NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(review_id, user_id)
);

ALTER TABLE public.clinic_review_helpful ENABLE ROW LEVEL SECURITY;

-- Dental Records (tooth-by-tooth data)
CREATE TABLE public.dental_records (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  patient_id UUID REFERENCES public.patients(id) ON DELETE CASCADE NOT NULL,
  clinic_id UUID REFERENCES public.clinics(id) NOT NULL,
  tooth_number VARCHAR(10) NOT NULL,
  tooth_condition VARCHAR(50),
  findings TEXT,
  diagnosis TEXT,
  images JSONB DEFAULT '[]'::jsonb,
  chart_data JSONB DEFAULT '{}'::jsonb,
  recorded_by UUID REFERENCES auth.users(id),
  record_date DATE NOT NULL,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE public.dental_records ENABLE ROW LEVEL SECURITY;

-- Treatment Catalog (pre-defined treatments with pricing)
CREATE TABLE public.treatment_catalog (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  clinic_id UUID REFERENCES public.clinics(id) ON DELETE CASCADE,
  code VARCHAR(50) NOT NULL,
  name VARCHAR(255) NOT NULL,
  arabic_name VARCHAR(255) NOT NULL,
  description TEXT,
  arabic_description TEXT,
  category VARCHAR(100),
  default_price DECIMAL(10, 2) NOT NULL,
  duration_minutes INTEGER,
  is_active BOOLEAN DEFAULT true,
  is_global BOOLEAN DEFAULT false,
  requires_lab BOOLEAN DEFAULT false,
  requires_materials BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(clinic_id, code)
);

ALTER TABLE public.treatment_catalog ENABLE ROW LEVEL SECURITY;

-- Invoices (detailed billing per treatment)
CREATE TABLE public.invoices (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  invoice_number VARCHAR(100) UNIQUE NOT NULL,
  clinic_id UUID REFERENCES public.clinics(id) NOT NULL,
  patient_id UUID REFERENCES public.patients(id) NOT NULL,
  appointment_id UUID REFERENCES public.appointments(id),
  treatment_plan_id UUID REFERENCES public.treatment_plans(id),
  invoice_date DATE NOT NULL,
  due_date DATE,
  subtotal DECIMAL(10, 2) NOT NULL,
  discount DECIMAL(10, 2) DEFAULT 0.00,
  tax DECIMAL(10, 2) DEFAULT 0.00,
  total DECIMAL(10, 2) NOT NULL,
  paid_amount DECIMAL(10, 2) DEFAULT 0.00,
  balance DECIMAL(10, 2) NOT NULL,
  status VARCHAR(50) DEFAULT 'unpaid' CHECK (status IN ('unpaid', 'partially_paid', 'paid', 'overdue', 'cancelled')),
  payment_method VARCHAR(100),
  payment_date DATE,
  notes TEXT,
  items JSONB DEFAULT '[]'::jsonb,
  created_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE public.invoices ENABLE ROW LEVEL SECURITY;

-- Invoice Items (detailed breakdown)
CREATE TABLE public.invoice_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  invoice_id UUID REFERENCES public.invoices(id) ON DELETE CASCADE NOT NULL,
  treatment_catalog_id UUID REFERENCES public.treatment_catalog(id),
  description VARCHAR(255) NOT NULL,
  arabic_description VARCHAR(255),
  quantity INTEGER DEFAULT 1,
  unit_price DECIMAL(10, 2) NOT NULL,
  discount DECIMAL(10, 2) DEFAULT 0.00,
  total DECIMAL(10, 2) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE public.invoice_items ENABLE ROW LEVEL SECURITY;

-- Clinic Settings (per-clinic configurations)
CREATE TABLE public.clinic_settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  clinic_id UUID REFERENCES public.clinics(id) ON DELETE CASCADE NOT NULL UNIQUE,
  booking_enabled BOOLEAN DEFAULT true,
  booking_advance_days INTEGER DEFAULT 30,
  booking_buffer_minutes INTEGER DEFAULT 15,
  appointment_duration_default INTEGER DEFAULT 30,
  work_hours JSONB DEFAULT '{}'::jsonb,
  break_times JSONB DEFAULT '[]'::jsonb,
  holidays JSONB DEFAULT '[]'::jsonb,
  notification_preferences JSONB DEFAULT '{}'::jsonb,
  invoice_settings JSONB DEFAULT '{}'::jsonb,
  language_preference VARCHAR(10) DEFAULT 'ar',
  timezone VARCHAR(50) DEFAULT 'Asia/Baghdad',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE public.clinic_settings ENABLE ROW LEVEL SECURITY;

-- Payments (unified payment tracking)
CREATE TABLE public.payments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  payment_type VARCHAR(50) NOT NULL CHECK (payment_type IN ('subscription', 'invoice', 'order', 'lab_order')),
  related_id UUID NOT NULL,
  clinic_id UUID REFERENCES public.clinics(id),
  patient_id UUID REFERENCES public.patients(id),
  amount DECIMAL(10, 2) NOT NULL,
  currency VARCHAR(10) DEFAULT 'IQD',
  payment_method VARCHAR(100),
  status VARCHAR(50) DEFAULT 'pending' CHECK (status IN ('pending', 'processing', 'completed', 'failed', 'refunded')),
  transaction_id VARCHAR(255),
  payment_date TIMESTAMP WITH TIME ZONE,
  notes TEXT,
  metadata JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE public.payments ENABLE ROW LEVEL SECURITY;

-- Triggers
CREATE TRIGGER update_subscription_plans_updated_at
BEFORE UPDATE ON public.subscription_plans
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_conversations_updated_at
BEFORE UPDATE ON public.conversations
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_dental_records_updated_at
BEFORE UPDATE ON public.dental_records
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_treatment_catalog_updated_at
BEFORE UPDATE ON public.treatment_catalog
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_invoices_updated_at
BEFORE UPDATE ON public.invoices
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_clinic_settings_updated_at
BEFORE UPDATE ON public.clinic_settings
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_payments_updated_at
BEFORE UPDATE ON public.payments
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- RLS Policies

-- Subscription Plans
CREATE POLICY "Subscription plans are viewable by everyone"
ON public.subscription_plans FOR SELECT
TO authenticated
USING (is_active = true);

CREATE POLICY "Platform admins can manage subscription plans"
ON public.subscription_plans FOR ALL
TO authenticated
USING (public.has_role(auth.uid(), 'platform_admin'));

-- Conversations
CREATE POLICY "Users can view their conversations"
ON public.conversations FOR SELECT
TO authenticated
USING (
  auth.uid()::text = ANY(SELECT jsonb_array_elements_text(participant_ids))
);

CREATE POLICY "Users can create conversations"
ON public.conversations FOR INSERT
TO authenticated
WITH CHECK (
  auth.uid()::text = ANY(SELECT jsonb_array_elements_text(participant_ids))
);

-- Messages
CREATE POLICY "Users can view messages in their conversations"
ON public.messages FOR SELECT
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.conversations
    WHERE conversations.id = messages.conversation_id
    AND auth.uid()::text = ANY(SELECT jsonb_array_elements_text(conversations.participant_ids))
  )
);

CREATE POLICY "Users can send messages"
ON public.messages FOR INSERT
TO authenticated
WITH CHECK (sender_id = auth.uid());

CREATE POLICY "Users can update their messages"
ON public.messages FOR UPDATE
TO authenticated
USING (sender_id = auth.uid());

-- Community Post Likes
CREATE POLICY "Users can manage their own likes"
ON public.community_post_likes FOR ALL
TO authenticated
USING (user_id = auth.uid());

CREATE POLICY "Likes are viewable by everyone"
ON public.community_post_likes FOR SELECT
TO authenticated
USING (true);

-- Review Helpful
CREATE POLICY "Users can manage their review helpful votes"
ON public.review_helpful FOR ALL
TO authenticated
USING (user_id = auth.uid());

CREATE POLICY "Review helpful votes are viewable by everyone"
ON public.review_helpful FOR SELECT
TO authenticated
USING (true);

-- Clinic Review Helpful
CREATE POLICY "Users can manage their clinic review helpful votes"
ON public.clinic_review_helpful FOR ALL
TO authenticated
USING (user_id = auth.uid());

-- Dental Records
CREATE POLICY "Clinic staff can view dental records"
ON public.dental_records FOR SELECT
TO authenticated
USING (public.is_clinic_staff(auth.uid(), clinic_id) OR public.is_clinic_owner(auth.uid(), clinic_id));

CREATE POLICY "Clinic staff can create dental records"
ON public.dental_records FOR INSERT
TO authenticated
WITH CHECK (public.is_clinic_staff(auth.uid(), clinic_id) OR public.is_clinic_owner(auth.uid(), clinic_id));

CREATE POLICY "Clinic staff can update dental records"
ON public.dental_records FOR UPDATE
TO authenticated
USING (public.is_clinic_staff(auth.uid(), clinic_id) OR public.is_clinic_owner(auth.uid(), clinic_id));

-- Treatment Catalog
CREATE POLICY "Active treatments are viewable by clinic staff"
ON public.treatment_catalog FOR SELECT
TO authenticated
USING (
  is_active = true AND (
    is_global = true OR
    public.is_clinic_staff(auth.uid(), clinic_id) OR 
    public.is_clinic_owner(auth.uid(), clinic_id)
  )
);

CREATE POLICY "Clinic owners can manage their treatment catalog"
ON public.treatment_catalog FOR ALL
TO authenticated
USING (public.is_clinic_owner(auth.uid(), clinic_id));

CREATE POLICY "Platform admins can manage global catalog"
ON public.treatment_catalog FOR ALL
TO authenticated
USING (public.has_role(auth.uid(), 'platform_admin'));

-- Invoices
CREATE POLICY "Clinic staff can view their clinic invoices"
ON public.invoices FOR SELECT
TO authenticated
USING (public.is_clinic_staff(auth.uid(), clinic_id) OR public.is_clinic_owner(auth.uid(), clinic_id));

CREATE POLICY "Clinic staff can create invoices"
ON public.invoices FOR INSERT
TO authenticated
WITH CHECK (public.is_clinic_staff(auth.uid(), clinic_id) OR public.is_clinic_owner(auth.uid(), clinic_id));

CREATE POLICY "Clinic staff can update invoices"
ON public.invoices FOR UPDATE
TO authenticated
USING (public.is_clinic_staff(auth.uid(), clinic_id) OR public.is_clinic_owner(auth.uid(), clinic_id));

-- Invoice Items
CREATE POLICY "Users can view invoice items"
ON public.invoice_items FOR SELECT
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.invoices
    WHERE invoices.id = invoice_items.invoice_id
    AND (public.is_clinic_staff(auth.uid(), invoices.clinic_id) OR public.is_clinic_owner(auth.uid(), invoices.clinic_id))
  )
);

-- Clinic Settings
CREATE POLICY "Clinic staff can view their clinic settings"
ON public.clinic_settings FOR SELECT
TO authenticated
USING (public.is_clinic_staff(auth.uid(), clinic_id) OR public.is_clinic_owner(auth.uid(), clinic_id));

CREATE POLICY "Clinic owners can manage their clinic settings"
ON public.clinic_settings FOR ALL
TO authenticated
USING (public.is_clinic_owner(auth.uid(), clinic_id));

-- Payments
CREATE POLICY "Users can view their payments"
ON public.payments FOR SELECT
TO authenticated
USING (
  patient_id IS NOT NULL AND EXISTS (
    SELECT 1 FROM public.patients
    WHERE patients.id = payments.patient_id
    AND patients.created_by = auth.uid()
  ) OR
  public.is_clinic_staff(auth.uid(), clinic_id) OR 
  public.is_clinic_owner(auth.uid(), clinic_id)
);

CREATE POLICY "Clinic staff can create payments"
ON public.payments FOR INSERT
TO authenticated
WITH CHECK (public.is_clinic_staff(auth.uid(), clinic_id) OR public.is_clinic_owner(auth.uid(), clinic_id));

CREATE POLICY "Clinic staff can update payments"
ON public.payments FOR UPDATE
TO authenticated
USING (public.is_clinic_staff(auth.uid(), clinic_id) OR public.is_clinic_owner(auth.uid(), clinic_id));

CREATE POLICY "Platform admins can manage all payments"
ON public.payments FOR ALL
TO authenticated
USING (public.has_role(auth.uid(), 'platform_admin'));

-- Indexes
CREATE INDEX idx_conversations_clinic ON public.conversations(clinic_id);
CREATE INDEX idx_messages_conversation ON public.messages(conversation_id);
CREATE INDEX idx_messages_sender ON public.messages(sender_id);
CREATE INDEX idx_community_post_likes_post ON public.community_post_likes(post_id);
CREATE INDEX idx_community_post_likes_user ON public.community_post_likes(user_id);
CREATE INDEX idx_review_helpful_review ON public.review_helpful(review_id);
CREATE INDEX idx_dental_records_patient ON public.dental_records(patient_id);
CREATE INDEX idx_dental_records_clinic ON public.dental_records(clinic_id);
CREATE INDEX idx_treatment_catalog_clinic ON public.treatment_catalog(clinic_id);
CREATE INDEX idx_invoices_clinic ON public.invoices(clinic_id);
CREATE INDEX idx_invoices_patient ON public.invoices(patient_id);
CREATE INDEX idx_invoice_items_invoice ON public.invoice_items(invoice_id);
CREATE INDEX idx_payments_clinic ON public.payments(clinic_id);
CREATE INDEX idx_payments_patient ON public.payments(patient_id);
CREATE INDEX idx_payments_type_related ON public.payments(payment_type, related_id);