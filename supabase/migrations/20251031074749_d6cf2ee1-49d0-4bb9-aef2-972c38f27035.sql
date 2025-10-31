-- ============================================
-- SUPPLIERS & PRODUCTS SYSTEM TABLES
-- ============================================

-- Iraqi Provinces Table
CREATE TABLE public.iraqi_provinces (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name_en VARCHAR(100) NOT NULL UNIQUE,
  name_ar VARCHAR(100) NOT NULL,
  code VARCHAR(10) UNIQUE NOT NULL,
  region VARCHAR(50),
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE public.iraqi_provinces ENABLE ROW LEVEL SECURITY;

-- Suppliers Table
CREATE TABLE public.suppliers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  company_name VARCHAR(255) NOT NULL,
  arabic_company_name VARCHAR(255),
  email VARCHAR(255),
  phone VARCHAR(50),
  description TEXT,
  arabic_description TEXT,
  logo TEXT,
  cover_image TEXT,
  speciality VARCHAR(255),
  location VARCHAR(255),
  province VARCHAR(100),
  established INTEGER,
  verified BOOLEAN DEFAULT false,
  is_approved BOOLEAN DEFAULT false,
  approval_note TEXT,
  approved_at TIMESTAMP WITH TIME ZONE,
  approved_by UUID REFERENCES auth.users(id),
  rating DECIMAL(3, 2) DEFAULT 0.00,
  total_reviews INTEGER DEFAULT 0,
  total_products INTEGER DEFAULT 0,
  total_orders INTEGER DEFAULT 0,
  website VARCHAR(255),
  badges JSONB DEFAULT '[]'::jsonb,
  services JSONB DEFAULT '[]'::jsonb,
  certifications JSONB DEFAULT '[]'::jsonb,
  response_time VARCHAR(100),
  whatsapp VARCHAR(50),
  union_endorsed BOOLEAN DEFAULT false,
  union_endorsed_at TIMESTAMP WITH TIME ZONE,
  union_certificate_number VARCHAR(100),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE public.suppliers ENABLE ROW LEVEL SECURITY;

-- Categories Table
CREATE TABLE public.categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  arabic_name VARCHAR(255) NOT NULL,
  slug VARCHAR(255) UNIQUE NOT NULL,
  description TEXT,
  arabic_description TEXT,
  icon VARCHAR(255),
  image TEXT,
  parent_id UUID REFERENCES public.categories(id),
  display_order INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;

-- Brands Table
CREATE TABLE public.brands (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  arabic_name VARCHAR(255),
  slug VARCHAR(255) UNIQUE NOT NULL,
  logo TEXT,
  description TEXT,
  arabic_description TEXT,
  website VARCHAR(255),
  country_of_origin VARCHAR(100),
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE public.brands ENABLE ROW LEVEL SECURITY;

-- Products Table
CREATE TABLE public.products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  supplier_id UUID REFERENCES public.suppliers(id) ON DELETE CASCADE NOT NULL,
  category_id UUID REFERENCES public.categories(id) NOT NULL,
  brand_id UUID REFERENCES public.brands(id),
  name VARCHAR(255) NOT NULL,
  arabic_name VARCHAR(255) NOT NULL,
  slug VARCHAR(255) UNIQUE NOT NULL,
  description TEXT,
  arabic_description TEXT,
  sku VARCHAR(100) UNIQUE NOT NULL,
  barcode VARCHAR(100),
  price DECIMAL(10, 2) NOT NULL,
  original_price DECIMAL(10, 2),
  discount INTEGER DEFAULT 0,
  stock_quantity INTEGER DEFAULT 0,
  min_order_quantity INTEGER DEFAULT 1,
  max_order_quantity INTEGER,
  weight VARCHAR(50),
  dimensions VARCHAR(100),
  image TEXT NOT NULL,
  images JSONB DEFAULT '[]'::jsonb,
  features JSONB DEFAULT '[]'::jsonb,
  arabic_features JSONB DEFAULT '[]'::jsonb,
  specifications JSONB DEFAULT '{}'::jsonb,
  arabic_specifications JSONB DEFAULT '{}'::jsonb,
  tags JSONB DEFAULT '[]'::jsonb,
  arabic_tags JSONB DEFAULT '[]'::jsonb,
  warranty VARCHAR(100),
  certification JSONB DEFAULT '[]'::jsonb,
  country_of_origin VARCHAR(100),
  rating DECIMAL(3, 2) DEFAULT 0.00,
  review_count INTEGER DEFAULT 0,
  view_count INTEGER DEFAULT 0,
  order_count INTEGER DEFAULT 0,
  is_featured BOOLEAN DEFAULT false,
  is_new BOOLEAN DEFAULT false,
  is_active BOOLEAN DEFAULT true,
  free_shipping BOOLEAN DEFAULT false,
  estimated_days VARCHAR(50),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;

-- Orders Table
CREATE TABLE public.orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_number VARCHAR(100) UNIQUE NOT NULL,
  customer_id UUID REFERENCES auth.users(id) NOT NULL,
  status VARCHAR(50) NOT NULL DEFAULT 'pending',
  payment_status VARCHAR(50) NOT NULL DEFAULT 'pending',
  payment_method VARCHAR(100),
  subtotal DECIMAL(10, 2) NOT NULL,
  shipping_cost DECIMAL(10, 2) DEFAULT 0.00,
  tax DECIMAL(10, 2) DEFAULT 0.00,
  discount DECIMAL(10, 2) DEFAULT 0.00,
  total DECIMAL(10, 2) NOT NULL,
  shipping_address JSONB NOT NULL,
  billing_address JSONB,
  notes TEXT,
  tracking_number VARCHAR(255),
  estimated_delivery TIMESTAMP WITH TIME ZONE,
  delivered_at TIMESTAMP WITH TIME ZONE,
  cancelled_at TIMESTAMP WITH TIME ZONE,
  cancellation_reason TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;

-- Order Items Table
CREATE TABLE public.order_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id UUID REFERENCES public.orders(id) ON DELETE CASCADE NOT NULL,
  product_id UUID REFERENCES public.products(id) NOT NULL,
  supplier_id UUID REFERENCES public.suppliers(id) NOT NULL,
  product_name VARCHAR(255) NOT NULL,
  product_arabic_name VARCHAR(255),
  product_image TEXT,
  sku VARCHAR(100),
  price DECIMAL(10, 2) NOT NULL,
  quantity INTEGER NOT NULL,
  subtotal DECIMAL(10, 2) NOT NULL,
  commission_rate DECIMAL(5, 2) DEFAULT 10.00,
  commission_amount DECIMAL(10, 2) DEFAULT 0.00,
  status VARCHAR(50) DEFAULT 'pending',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE public.order_items ENABLE ROW LEVEL SECURITY;

-- Commission Settings Table
CREATE TABLE public.commission_settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  supplier_id UUID REFERENCES public.suppliers(id) NOT NULL UNIQUE,
  commission_rate DECIMAL(5, 2) NOT NULL DEFAULT 10.00,
  min_commission DECIMAL(10, 2) DEFAULT 0.00,
  is_active BOOLEAN DEFAULT true,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE public.commission_settings ENABLE ROW LEVEL SECURITY;

-- Cart Table
CREATE TABLE public.cart (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  product_id UUID REFERENCES public.products(id) ON DELETE CASCADE NOT NULL,
  quantity INTEGER NOT NULL DEFAULT 1,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE public.cart ENABLE ROW LEVEL SECURITY;

-- Favorites Table
CREATE TABLE public.favorites (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  product_id UUID REFERENCES public.products(id) ON DELETE CASCADE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, product_id)
);

ALTER TABLE public.favorites ENABLE ROW LEVEL SECURITY;

-- Reviews Table
CREATE TABLE public.reviews (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id UUID REFERENCES public.products(id) ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES auth.users(id) NOT NULL,
  order_id UUID REFERENCES public.orders(id),
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  title VARCHAR(255),
  comment TEXT,
  images JSONB DEFAULT '[]'::jsonb,
  is_verified BOOLEAN DEFAULT false,
  is_published BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;

-- Order Returns Table
CREATE TABLE public.order_returns (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  return_number VARCHAR(100) UNIQUE NOT NULL,
  order_id UUID REFERENCES public.orders(id) NOT NULL,
  order_item_id UUID REFERENCES public.order_items(id),
  supplier_id UUID REFERENCES public.suppliers(id) NOT NULL,
  customer_id UUID REFERENCES auth.users(id) NOT NULL,
  reason VARCHAR(100) NOT NULL,
  reason_arabic VARCHAR(255),
  description TEXT,
  status VARCHAR(50) DEFAULT 'pending',
  quantity INTEGER NOT NULL,
  refund_amount DECIMAL(10, 2) NOT NULL,
  refund_method VARCHAR(100),
  images JSONB DEFAULT '[]'::jsonb,
  approved_by UUID REFERENCES auth.users(id),
  approved_at TIMESTAMP WITH TIME ZONE,
  rejection_reason TEXT,
  refunded_at TIMESTAMP WITH TIME ZONE,
  completed_at TIMESTAMP WITH TIME ZONE,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE public.order_returns ENABLE ROW LEVEL SECURITY;

-- Supplier Messages Table
CREATE TABLE public.supplier_messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  conversation_id VARCHAR(100) NOT NULL,
  supplier_id UUID REFERENCES public.suppliers(id) NOT NULL,
  customer_id UUID REFERENCES auth.users(id) NOT NULL,
  sender_id UUID REFERENCES auth.users(id) NOT NULL,
  sender_type VARCHAR(50) NOT NULL CHECK (sender_type IN ('supplier', 'customer')),
  message TEXT NOT NULL,
  attachments JSONB DEFAULT '[]'::jsonb,
  is_read BOOLEAN DEFAULT false,
  read_at TIMESTAMP WITH TIME ZONE,
  order_id UUID REFERENCES public.orders(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE public.supplier_messages ENABLE ROW LEVEL SECURITY;

-- Supplier Approvals Table
CREATE TABLE public.supplier_approvals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  supplier_id UUID REFERENCES public.suppliers(id) NOT NULL,
  status VARCHAR(50) DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
  notes TEXT,
  reviewed_by UUID REFERENCES auth.users(id),
  reviewed_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE public.supplier_approvals ENABLE ROW LEVEL SECURITY;

-- Supplier Analytics Table
CREATE TABLE public.supplier_analytics (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  supplier_id UUID REFERENCES public.suppliers(id) NOT NULL,
  date DATE NOT NULL,
  views INTEGER DEFAULT 0,
  product_views INTEGER DEFAULT 0,
  orders INTEGER DEFAULT 0,
  revenue DECIMAL(10, 2) DEFAULT 0.00,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(supplier_id, date)
);

ALTER TABLE public.supplier_analytics ENABLE ROW LEVEL SECURITY;

-- Triggers for updated_at
CREATE TRIGGER update_suppliers_updated_at
BEFORE UPDATE ON public.suppliers
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_categories_updated_at
BEFORE UPDATE ON public.categories
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_brands_updated_at
BEFORE UPDATE ON public.brands
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_products_updated_at
BEFORE UPDATE ON public.products
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_orders_updated_at
BEFORE UPDATE ON public.orders
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_order_items_updated_at
BEFORE UPDATE ON public.order_items
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_commission_settings_updated_at
BEFORE UPDATE ON public.commission_settings
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_cart_updated_at
BEFORE UPDATE ON public.cart
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_reviews_updated_at
BEFORE UPDATE ON public.reviews
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_order_returns_updated_at
BEFORE UPDATE ON public.order_returns
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- RLS Policies for Iraqi Provinces
CREATE POLICY "Iraqi provinces are viewable by everyone"
ON public.iraqi_provinces FOR SELECT
TO authenticated
USING (true);

CREATE POLICY "Platform admins can manage provinces"
ON public.iraqi_provinces FOR ALL
TO authenticated
USING (public.has_role(auth.uid(), 'platform_admin'));

-- RLS Policies for Suppliers
CREATE POLICY "Suppliers can view their own profile"
ON public.suppliers FOR SELECT
TO authenticated
USING (user_id = auth.uid());

CREATE POLICY "Platform admins can view all suppliers"
ON public.suppliers FOR SELECT
TO authenticated
USING (public.has_role(auth.uid(), 'platform_admin'));

CREATE POLICY "Public can view approved suppliers"
ON public.suppliers FOR SELECT
TO authenticated
USING (is_approved = true);

CREATE POLICY "Users can create supplier profile"
ON public.suppliers FOR INSERT
TO authenticated
WITH CHECK (user_id = auth.uid());

CREATE POLICY "Suppliers can update their own profile"
ON public.suppliers FOR UPDATE
TO authenticated
USING (user_id = auth.uid());

CREATE POLICY "Platform admins can manage all suppliers"
ON public.suppliers FOR ALL
TO authenticated
USING (public.has_role(auth.uid(), 'platform_admin'));

-- RLS Policies for Categories
CREATE POLICY "Categories are viewable by everyone"
ON public.categories FOR SELECT
TO authenticated
USING (is_active = true);

CREATE POLICY "Platform admins can manage categories"
ON public.categories FOR ALL
TO authenticated
USING (public.has_role(auth.uid(), 'platform_admin'));

-- RLS Policies for Brands
CREATE POLICY "Brands are viewable by everyone"
ON public.brands FOR SELECT
TO authenticated
USING (is_active = true);

CREATE POLICY "Platform admins can manage brands"
ON public.brands FOR ALL
TO authenticated
USING (public.has_role(auth.uid(), 'platform_admin'));

-- RLS Policies for Products
CREATE POLICY "Active products are viewable by everyone"
ON public.products FOR SELECT
TO authenticated
USING (is_active = true);

CREATE POLICY "Suppliers can view their own products"
ON public.products FOR SELECT
TO authenticated
USING (EXISTS (
  SELECT 1 FROM public.suppliers
  WHERE suppliers.id = products.supplier_id
  AND suppliers.user_id = auth.uid()
));

CREATE POLICY "Suppliers can create their own products"
ON public.products FOR INSERT
TO authenticated
WITH CHECK (EXISTS (
  SELECT 1 FROM public.suppliers
  WHERE suppliers.id = supplier_id
  AND suppliers.user_id = auth.uid()
));

CREATE POLICY "Suppliers can update their own products"
ON public.products FOR UPDATE
TO authenticated
USING (EXISTS (
  SELECT 1 FROM public.suppliers
  WHERE suppliers.id = products.supplier_id
  AND suppliers.user_id = auth.uid()
));

CREATE POLICY "Suppliers can delete their own products"
ON public.products FOR DELETE
TO authenticated
USING (EXISTS (
  SELECT 1 FROM public.suppliers
  WHERE suppliers.id = products.supplier_id
  AND suppliers.user_id = auth.uid()
));

CREATE POLICY "Platform admins can manage all products"
ON public.products FOR ALL
TO authenticated
USING (public.has_role(auth.uid(), 'platform_admin'));

-- RLS Policies for Orders
CREATE POLICY "Users can view their own orders"
ON public.orders FOR SELECT
TO authenticated
USING (customer_id = auth.uid());

CREATE POLICY "Users can create their own orders"
ON public.orders FOR INSERT
TO authenticated
WITH CHECK (customer_id = auth.uid());

CREATE POLICY "Suppliers can view orders containing their products"
ON public.orders FOR SELECT
TO authenticated
USING (EXISTS (
  SELECT 1 FROM public.order_items oi
  JOIN public.suppliers s ON s.id = oi.supplier_id
  WHERE oi.order_id = orders.id
  AND s.user_id = auth.uid()
));

CREATE POLICY "Platform admins can view all orders"
ON public.orders FOR SELECT
TO authenticated
USING (public.has_role(auth.uid(), 'platform_admin'));

-- RLS Policies for Order Items
CREATE POLICY "Users can view their order items"
ON public.order_items FOR SELECT
TO authenticated
USING (EXISTS (
  SELECT 1 FROM public.orders
  WHERE orders.id = order_items.order_id
  AND orders.customer_id = auth.uid()
));

CREATE POLICY "Suppliers can view their order items"
ON public.order_items FOR SELECT
TO authenticated
USING (EXISTS (
  SELECT 1 FROM public.suppliers
  WHERE suppliers.id = order_items.supplier_id
  AND suppliers.user_id = auth.uid()
));

CREATE POLICY "Platform admins can manage order items"
ON public.order_items FOR ALL
TO authenticated
USING (public.has_role(auth.uid(), 'platform_admin'));

-- RLS Policies for Cart
CREATE POLICY "Users can manage their own cart"
ON public.cart FOR ALL
TO authenticated
USING (user_id = auth.uid());

-- RLS Policies for Favorites
CREATE POLICY "Users can manage their own favorites"
ON public.favorites FOR ALL
TO authenticated
USING (user_id = auth.uid());

-- RLS Policies for Reviews
CREATE POLICY "Published reviews are viewable by everyone"
ON public.reviews FOR SELECT
TO authenticated
USING (is_published = true);

CREATE POLICY "Users can create reviews for their orders"
ON public.reviews FOR INSERT
TO authenticated
WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can update their own reviews"
ON public.reviews FOR UPDATE
TO authenticated
USING (user_id = auth.uid());

CREATE POLICY "Platform admins can manage all reviews"
ON public.reviews FOR ALL
TO authenticated
USING (public.has_role(auth.uid(), 'platform_admin'));

-- RLS Policies for Supplier Messages
CREATE POLICY "Users can view their messages"
ON public.supplier_messages FOR SELECT
TO authenticated
USING (
  sender_id = auth.uid() OR
  customer_id = auth.uid() OR
  EXISTS (
    SELECT 1 FROM public.suppliers
    WHERE suppliers.id = supplier_messages.supplier_id
    AND suppliers.user_id = auth.uid()
  )
);

CREATE POLICY "Users can send messages"
ON public.supplier_messages FOR INSERT
TO authenticated
WITH CHECK (sender_id = auth.uid());

CREATE POLICY "Users can update their messages"
ON public.supplier_messages FOR UPDATE
TO authenticated
USING (
  customer_id = auth.uid() OR
  EXISTS (
    SELECT 1 FROM public.suppliers
    WHERE suppliers.id = supplier_messages.supplier_id
    AND suppliers.user_id = auth.uid()
  )
);

-- Indexes for better performance
CREATE INDEX idx_suppliers_user_id ON public.suppliers(user_id);
CREATE INDEX idx_suppliers_province ON public.suppliers(province);
CREATE INDEX idx_suppliers_approved ON public.suppliers(is_approved);
CREATE INDEX idx_products_supplier_id ON public.products(supplier_id);
CREATE INDEX idx_products_category_id ON public.products(category_id);
CREATE INDEX idx_products_brand_id ON public.products(brand_id);
CREATE INDEX idx_products_slug ON public.products(slug);
CREATE INDEX idx_products_active ON public.products(is_active);
CREATE INDEX idx_orders_customer_id ON public.orders(customer_id);
CREATE INDEX idx_orders_status ON public.orders(status);
CREATE INDEX idx_order_items_order_id ON public.order_items(order_id);
CREATE INDEX idx_order_items_supplier_id ON public.order_items(supplier_id);
CREATE INDEX idx_cart_user_id ON public.cart(user_id);
CREATE INDEX idx_favorites_user_id ON public.favorites(user_id);
CREATE INDEX idx_reviews_product_id ON public.reviews(product_id);
CREATE INDEX idx_supplier_messages_conversation ON public.supplier_messages(conversation_id);
CREATE INDEX idx_supplier_analytics_supplier_date ON public.supplier_analytics(supplier_id, date);