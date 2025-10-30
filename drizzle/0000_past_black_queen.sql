CREATE TABLE "api_keys" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" varchar(255) NOT NULL,
	"arabic_name" varchar(255),
	"key_value" varchar(500) NOT NULL,
	"service_id" integer,
	"permissions" jsonb DEFAULT '[]'::jsonb,
	"is_active" boolean DEFAULT true,
	"expires_at" timestamp,
	"last_used" timestamp,
	"usage_count" integer DEFAULT 0,
	"rate_limit" integer,
	"created_by" integer,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "api_keys_key_value_unique" UNIQUE("key_value")
);
--> statement-breakpoint
CREATE TABLE "brands" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" varchar(255) NOT NULL,
	"arabic_name" varchar(255),
	"slug" varchar(255) NOT NULL,
	"logo" text,
	"description" text,
	"arabic_description" text,
	"website" varchar(255),
	"country_of_origin" varchar(100),
	"is_active" boolean DEFAULT true,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "brands_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
CREATE TABLE "cart" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" integer NOT NULL,
	"product_id" integer NOT NULL,
	"quantity" integer DEFAULT 1 NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "cash_payment_centers" (
	"id" serial PRIMARY KEY NOT NULL,
	"governorate" varchar(100) NOT NULL,
	"governorate_arabic" varchar(100) NOT NULL,
	"center_name" varchar(255) NOT NULL,
	"center_name_arabic" varchar(255) NOT NULL,
	"address" text,
	"address_arabic" text,
	"phone_number" varchar(20),
	"alternative_phone" varchar(20),
	"working_hours" varchar(255),
	"working_hours_arabic" varchar(255),
	"latitude" numeric(10, 7),
	"longitude" numeric(10, 7),
	"is_active" boolean DEFAULT true,
	"display_order" integer DEFAULT 0,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "categories" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" varchar(255) NOT NULL,
	"arabic_name" varchar(255) NOT NULL,
	"slug" varchar(255) NOT NULL,
	"description" text,
	"arabic_description" text,
	"icon" varchar(255),
	"image" text,
	"parent_id" integer,
	"order" integer DEFAULT 0,
	"is_active" boolean DEFAULT true,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "categories_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
CREATE TABLE "clinic_payments" (
	"id" serial PRIMARY KEY NOT NULL,
	"clinic_id" integer NOT NULL,
	"plan_id" integer NOT NULL,
	"amount" numeric(10, 2) NOT NULL,
	"currency" varchar(10) DEFAULT 'IQD',
	"payment_method" varchar(100),
	"stripe_payment_id" varchar(255),
	"stripe_customer_id" varchar(255),
	"zain_cash_transfer_number" varchar(100),
	"zain_cash_transfer_amount" numeric(10, 2),
	"zain_cash_transaction_id" varchar(255),
	"cash_center_id" integer,
	"cash_receipt_number" varchar(100),
	"coupon_id" integer,
	"coupon_code" varchar(50),
	"discount_amount" numeric(10, 2) DEFAULT '0.00',
	"status" varchar(50) DEFAULT 'pending' NOT NULL,
	"payment_date" timestamp,
	"subscription_start_date" timestamp,
	"subscription_end_date" timestamp,
	"invoice_url" text,
	"notes" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "clinics" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" integer,
	"name" varchar(255) NOT NULL,
	"arabic_name" varchar(255) NOT NULL,
	"description" text,
	"arabic_description" text,
	"phone" varchar(50) NOT NULL,
	"email" varchar(255),
	"address" text NOT NULL,
	"arabic_address" text,
	"governorate" varchar(100) NOT NULL,
	"city" varchar(100) NOT NULL,
	"location_lat" numeric(10, 7) NOT NULL,
	"location_lng" numeric(10, 7) NOT NULL,
	"specialty" jsonb DEFAULT '[]'::jsonb,
	"arabic_specialty" jsonb DEFAULT '[]'::jsonb,
	"doctor_name" varchar(255),
	"arabic_doctor_name" varchar(255),
	"rating" numeric(3, 2) DEFAULT '0.00',
	"review_count" integer DEFAULT 0,
	"image" text,
	"images" jsonb DEFAULT '[]'::jsonb,
	"working_hours" jsonb DEFAULT '{}'::jsonb,
	"services" jsonb DEFAULT '[]'::jsonb,
	"arabic_services" jsonb DEFAULT '[]'::jsonb,
	"subscription_tier" varchar(50) DEFAULT 'free',
	"subscription_start" timestamp,
	"subscription_end" timestamp,
	"is_promoted" boolean DEFAULT false,
	"priority_level" integer DEFAULT 0,
	"is_active" boolean DEFAULT true,
	"is_verified" boolean DEFAULT false,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "commission_invoices" (
	"id" serial PRIMARY KEY NOT NULL,
	"invoice_number" varchar(100) NOT NULL,
	"supplier_id" integer NOT NULL,
	"period_start" timestamp NOT NULL,
	"period_end" timestamp NOT NULL,
	"total_sales" numeric(12, 2) NOT NULL,
	"total_commission" numeric(12, 2) NOT NULL,
	"status" varchar(50) DEFAULT 'pending',
	"due_date" timestamp,
	"paid_at" timestamp,
	"paid_amount" numeric(12, 2) DEFAULT '0.00',
	"payment_method" varchar(100),
	"payment_reference" varchar(255),
	"notes" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "commission_invoices_invoice_number_unique" UNIQUE("invoice_number")
);
--> statement-breakpoint
CREATE TABLE "commission_settings" (
	"id" serial PRIMARY KEY NOT NULL,
	"supplier_id" integer NOT NULL,
	"commission_rate" numeric(5, 2) DEFAULT '10.00' NOT NULL,
	"min_commission" numeric(10, 2) DEFAULT '0.00',
	"is_active" boolean DEFAULT true,
	"notes" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "commission_settings_supplier_id_unique" UNIQUE("supplier_id")
);
--> statement-breakpoint
CREATE TABLE "community_3d_models" (
	"id" serial PRIMARY KEY NOT NULL,
	"title" varchar(255) NOT NULL,
	"arabic_title" varchar(255) NOT NULL,
	"description" text,
	"arabic_description" text,
	"sketchfab_url" text NOT NULL,
	"sketchfab_type" varchar(50) NOT NULL,
	"sketchfab_id" varchar(255),
	"embed_code" text,
	"thumbnail" text,
	"category" varchar(100),
	"tags" jsonb DEFAULT '[]'::jsonb,
	"arabic_tags" jsonb DEFAULT '[]'::jsonb,
	"model_type" varchar(100),
	"is_active" boolean DEFAULT true,
	"view_count" integer DEFAULT 0,
	"added_by" integer,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "community_comment_likes" (
	"id" serial PRIMARY KEY NOT NULL,
	"comment_id" integer NOT NULL,
	"user_id" integer NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "community_comments" (
	"id" serial PRIMARY KEY NOT NULL,
	"post_id" integer NOT NULL,
	"author_id" integer NOT NULL,
	"parent_comment_id" integer,
	"content" text NOT NULL,
	"like_count" integer DEFAULT 0,
	"is_approved" boolean DEFAULT true,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "community_course_enrollments" (
	"id" serial PRIMARY KEY NOT NULL,
	"course_id" integer NOT NULL,
	"user_id" integer NOT NULL,
	"progress" integer DEFAULT 0,
	"status" varchar(50) DEFAULT 'enrolled',
	"completed_at" timestamp,
	"enrolled_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "community_courses" (
	"id" serial PRIMARY KEY NOT NULL,
	"title" varchar(255) NOT NULL,
	"arabic_title" varchar(255) NOT NULL,
	"description" text,
	"arabic_description" text,
	"instructor" varchar(255) NOT NULL,
	"arabic_instructor" varchar(255),
	"cover_image" text,
	"duration" varchar(100),
	"level" varchar(50) DEFAULT 'beginner',
	"price" numeric(10, 2) DEFAULT '0.00',
	"original_price" numeric(10, 2),
	"discount" integer DEFAULT 0,
	"category" varchar(100),
	"tags" jsonb DEFAULT '[]'::jsonb,
	"arabic_tags" jsonb DEFAULT '[]'::jsonb,
	"enrollment_count" integer DEFAULT 0,
	"rating" numeric(3, 2) DEFAULT '0.00',
	"review_count" integer DEFAULT 0,
	"is_active" boolean DEFAULT true,
	"is_featured" boolean DEFAULT false,
	"start_date" timestamp,
	"end_date" timestamp,
	"created_by" integer,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "community_educational_content" (
	"id" serial PRIMARY KEY NOT NULL,
	"title" varchar(255) NOT NULL,
	"arabic_title" varchar(255) NOT NULL,
	"content" text NOT NULL,
	"arabic_content" text NOT NULL,
	"excerpt" text,
	"arabic_excerpt" text,
	"content_type" varchar(50) DEFAULT 'article' NOT NULL,
	"cover_image" text,
	"images" jsonb DEFAULT '[]'::jsonb,
	"category" varchar(100),
	"tags" jsonb DEFAULT '[]'::jsonb,
	"arabic_tags" jsonb DEFAULT '[]'::jsonb,
	"author_id" integer NOT NULL,
	"status" varchar(50) DEFAULT 'pending',
	"is_approved" boolean DEFAULT false,
	"approved_by" integer,
	"approved_at" timestamp,
	"rejection_reason" text,
	"is_pinned" boolean DEFAULT false,
	"is_featured" boolean DEFAULT false,
	"read_time" integer,
	"view_count" integer DEFAULT 0,
	"like_count" integer DEFAULT 0,
	"comment_count" integer DEFAULT 0,
	"share_count" integer DEFAULT 0,
	"published_at" timestamp,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "community_events" (
	"id" serial PRIMARY KEY NOT NULL,
	"title" varchar(255) NOT NULL,
	"arabic_title" varchar(255) NOT NULL,
	"description" text,
	"arabic_description" text,
	"event_type" varchar(50) DEFAULT 'webinar' NOT NULL,
	"is_external" boolean DEFAULT false,
	"external_url" text,
	"platform" varchar(100),
	"meeting_link" text,
	"start_date" timestamp NOT NULL,
	"end_date" timestamp NOT NULL,
	"duration" integer,
	"max_attendees" integer,
	"current_attendees" integer DEFAULT 0,
	"speaker_name" varchar(255),
	"speaker_bio" text,
	"speaker_image" text,
	"cover_image" text,
	"tags" jsonb DEFAULT '[]'::jsonb,
	"arabic_tags" jsonb DEFAULT '[]'::jsonb,
	"category" varchar(100),
	"price" numeric(10, 2) DEFAULT '0.00',
	"is_free" boolean DEFAULT true,
	"status" varchar(50) DEFAULT 'upcoming',
	"registration_deadline" timestamp,
	"created_by" integer,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "community_follows" (
	"id" serial PRIMARY KEY NOT NULL,
	"follower_id" integer NOT NULL,
	"followed_id" integer NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "community_group_members" (
	"id" serial PRIMARY KEY NOT NULL,
	"group_id" integer NOT NULL,
	"user_id" integer NOT NULL,
	"role" varchar(50) DEFAULT 'member',
	"joined_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "community_groups" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" varchar(255) NOT NULL,
	"arabic_name" varchar(255) NOT NULL,
	"description" text,
	"arabic_description" text,
	"cover_image" text,
	"creator_id" integer NOT NULL,
	"group_type" varchar(50) DEFAULT 'public',
	"member_count" integer DEFAULT 0,
	"post_count" integer DEFAULT 0,
	"is_active" boolean DEFAULT true,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "community_moderators" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" integer NOT NULL,
	"role" varchar(50) DEFAULT 'moderator' NOT NULL,
	"province" varchar(100),
	"badge" varchar(100),
	"badge_color" varchar(50),
	"permissions" jsonb DEFAULT '[]'::jsonb,
	"bio" text,
	"specialization" varchar(255),
	"can_publish_educational" boolean DEFAULT false,
	"can_moderate" boolean DEFAULT false,
	"is_active" boolean DEFAULT true,
	"assigned_by" integer,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "community_post_likes" (
	"id" serial PRIMARY KEY NOT NULL,
	"post_id" integer NOT NULL,
	"user_id" integer NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "community_post_saves" (
	"id" serial PRIMARY KEY NOT NULL,
	"post_id" integer NOT NULL,
	"user_id" integer NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "community_posts" (
	"id" serial PRIMARY KEY NOT NULL,
	"author_id" integer NOT NULL,
	"content" text NOT NULL,
	"image" text,
	"images" jsonb DEFAULT '[]'::jsonb,
	"post_type" varchar(50) DEFAULT 'general',
	"visibility" varchar(50) DEFAULT 'public',
	"is_pinned" boolean DEFAULT false,
	"is_approved" boolean DEFAULT true,
	"like_count" integer DEFAULT 0,
	"comment_count" integer DEFAULT 0,
	"share_count" integer DEFAULT 0,
	"view_count" integer DEFAULT 0,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "community_trusted_sources" (
	"id" serial PRIMARY KEY NOT NULL,
	"title" varchar(255) NOT NULL,
	"arabic_title" varchar(255) NOT NULL,
	"description" text,
	"arabic_description" text,
	"source_url" text NOT NULL,
	"source_name" varchar(255) NOT NULL,
	"source_type" varchar(50) NOT NULL,
	"thumbnail" text,
	"author" varchar(255),
	"publish_date" timestamp,
	"category" varchar(100),
	"tags" jsonb DEFAULT '[]'::jsonb,
	"arabic_tags" jsonb DEFAULT '[]'::jsonb,
	"is_active" boolean DEFAULT true,
	"view_count" integer DEFAULT 0,
	"click_count" integer DEFAULT 0,
	"added_by" integer,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "coupon_usage" (
	"id" serial PRIMARY KEY NOT NULL,
	"coupon_id" integer NOT NULL,
	"clinic_id" integer NOT NULL,
	"user_id" integer,
	"payment_id" integer,
	"discount_applied" numeric(10, 2) NOT NULL,
	"used_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "coupons" (
	"id" serial PRIMARY KEY NOT NULL,
	"code" varchar(50) NOT NULL,
	"discount_type" varchar(20) NOT NULL,
	"discount_value" numeric(10, 2) NOT NULL,
	"max_usage" integer DEFAULT 0,
	"current_usage" integer DEFAULT 0,
	"expiry_date" timestamp,
	"plan_ids" jsonb DEFAULT '[]'::jsonb,
	"is_active" boolean DEFAULT true,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "coupons_code_unique" UNIQUE("code")
);
--> statement-breakpoint
CREATE TABLE "delivery_history" (
	"id" serial PRIMARY KEY NOT NULL,
	"delivery_id" integer NOT NULL,
	"status" varchar(50) NOT NULL,
	"status_arabic" varchar(100),
	"location" varchar(255),
	"description" text,
	"description_arabic" text,
	"timestamp" timestamp DEFAULT now() NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "external_api_services" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" varchar(255) NOT NULL,
	"arabic_name" varchar(255),
	"type" varchar(100) NOT NULL,
	"base_url" varchar(500),
	"api_key_encrypted" text,
	"secret_key_encrypted" text,
	"additional_config" jsonb,
	"is_active" boolean DEFAULT true,
	"last_used" timestamp,
	"requests_count" integer DEFAULT 0,
	"notes" text,
	"created_by" integer,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "external_database_connections" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" varchar(255) NOT NULL,
	"arabic_name" varchar(255),
	"type" varchar(50) NOT NULL,
	"host" varchar(255),
	"port" integer,
	"database" varchar(255),
	"username" varchar(255),
	"password_encrypted" text,
	"connection_string" text,
	"is_active" boolean DEFAULT true,
	"last_connected" timestamp,
	"notes" text,
	"created_by" integer,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "favorites" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" integer NOT NULL,
	"product_id" integer NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "integration_logs" (
	"id" serial PRIMARY KEY NOT NULL,
	"service_id" integer,
	"action" varchar(100) NOT NULL,
	"status" varchar(50) NOT NULL,
	"request_data" jsonb,
	"response_data" jsonb,
	"error_message" text,
	"execution_time" integer,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "iraqi_provinces" (
	"id" serial PRIMARY KEY NOT NULL,
	"name_en" varchar(100) NOT NULL,
	"name_ar" varchar(100) NOT NULL,
	"code" varchar(10) NOT NULL,
	"region" varchar(50),
	"is_active" boolean DEFAULT true,
	"created_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "iraqi_provinces_name_en_unique" UNIQUE("name_en"),
	CONSTRAINT "iraqi_provinces_code_unique" UNIQUE("code")
);
--> statement-breakpoint
CREATE TABLE "manual_payment_reviews" (
	"id" serial PRIMARY KEY NOT NULL,
	"review_number" varchar(100) NOT NULL,
	"payment_type" varchar(50) NOT NULL,
	"reference_id" integer NOT NULL,
	"reference_type" varchar(50) NOT NULL,
	"payment_method" varchar(50) NOT NULL,
	"amount" numeric(10, 2) NOT NULL,
	"transaction_reference" varchar(255),
	"submitted_by" integer NOT NULL,
	"submitted_at" timestamp DEFAULT now() NOT NULL,
	"status" varchar(50) DEFAULT 'pending',
	"assigned_to" integer,
	"assigned_at" timestamp,
	"reviewed_by" integer,
	"reviewed_at" timestamp,
	"verification_method" varchar(100),
	"verification_details" jsonb DEFAULT '{}'::jsonb,
	"review_notes" text,
	"priority" varchar(50) DEFAULT 'normal',
	"attachments" jsonb DEFAULT '[]'::jsonb,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "manual_payment_reviews_review_number_unique" UNIQUE("review_number")
);
--> statement-breakpoint
CREATE TABLE "map_settings" (
	"id" serial PRIMARY KEY NOT NULL,
	"google_maps_api_key" text,
	"default_center_lat" numeric(10, 7) DEFAULT '33.3152',
	"default_center_lng" numeric(10, 7) DEFAULT '44.3661',
	"default_zoom" integer DEFAULT 12,
	"enable_geolocation" boolean DEFAULT true,
	"search_radius" integer DEFAULT 50,
	"max_clinics_to_show" integer DEFAULT 20,
	"promoted_clinics_first" boolean DEFAULT true,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "order_deliveries" (
	"id" serial PRIMARY KEY NOT NULL,
	"order_id" integer NOT NULL,
	"supplier_id" integer NOT NULL,
	"tracking_number" varchar(255),
	"carrier" varchar(100),
	"carrier_arabic" varchar(100),
	"status" varchar(50) DEFAULT 'pending',
	"shipping_cost" numeric(10, 2) DEFAULT '0.00',
	"estimated_delivery" timestamp,
	"picked_up_at" timestamp,
	"delivered_at" timestamp,
	"delivery_proof" jsonb,
	"recipient_name" varchar(255),
	"recipient_phone" varchar(50),
	"delivery_address" jsonb NOT NULL,
	"current_location" varchar(255),
	"failed_reason" text,
	"notes" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "order_items" (
	"id" serial PRIMARY KEY NOT NULL,
	"order_id" integer NOT NULL,
	"product_id" integer NOT NULL,
	"supplier_id" integer NOT NULL,
	"product_name" varchar(255) NOT NULL,
	"product_arabic_name" varchar(255),
	"product_image" text,
	"sku" varchar(100),
	"price" numeric(10, 2) NOT NULL,
	"quantity" integer NOT NULL,
	"subtotal" numeric(10, 2) NOT NULL,
	"commission_rate" numeric(5, 2) DEFAULT '10.00',
	"commission_amount" numeric(10, 2) DEFAULT '0.00',
	"status" varchar(50) DEFAULT 'pending',
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "order_returns" (
	"id" serial PRIMARY KEY NOT NULL,
	"return_number" varchar(100) NOT NULL,
	"order_id" integer NOT NULL,
	"order_item_id" integer,
	"supplier_id" integer NOT NULL,
	"customer_id" integer NOT NULL,
	"reason" varchar(100) NOT NULL,
	"reason_arabic" varchar(255),
	"description" text,
	"status" varchar(50) DEFAULT 'pending',
	"quantity" integer NOT NULL,
	"refund_amount" numeric(10, 2) NOT NULL,
	"refund_method" varchar(100),
	"images" jsonb DEFAULT '[]'::jsonb,
	"approved_by" integer,
	"approved_at" timestamp,
	"rejection_reason" text,
	"refunded_at" timestamp,
	"completed_at" timestamp,
	"notes" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "order_returns_return_number_unique" UNIQUE("return_number")
);
--> statement-breakpoint
CREATE TABLE "orders" (
	"id" serial PRIMARY KEY NOT NULL,
	"order_number" varchar(100) NOT NULL,
	"customer_id" integer NOT NULL,
	"status" varchar(50) DEFAULT 'pending' NOT NULL,
	"payment_status" varchar(50) DEFAULT 'pending' NOT NULL,
	"payment_method" varchar(100),
	"subtotal" numeric(10, 2) NOT NULL,
	"shipping_cost" numeric(10, 2) DEFAULT '0.00',
	"tax" numeric(10, 2) DEFAULT '0.00',
	"discount" numeric(10, 2) DEFAULT '0.00',
	"total" numeric(10, 2) NOT NULL,
	"shipping_address" jsonb NOT NULL,
	"billing_address" jsonb,
	"notes" text,
	"tracking_number" varchar(255),
	"estimated_delivery" timestamp,
	"delivered_at" timestamp,
	"cancelled_at" timestamp,
	"cancellation_reason" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "orders_order_number_unique" UNIQUE("order_number")
);
--> statement-breakpoint
CREATE TABLE "payment_methods" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" varchar(100) NOT NULL,
	"arabic_name" varchar(100) NOT NULL,
	"type" varchar(50) NOT NULL,
	"is_active" boolean DEFAULT true,
	"is_default" boolean DEFAULT false,
	"icon" varchar(255),
	"description" text,
	"arabic_description" text,
	"fees" numeric(5, 2) DEFAULT '0.00',
	"min_amount" numeric(10, 2) DEFAULT '0.00',
	"max_amount" numeric(10, 2),
	"config" jsonb DEFAULT '{}'::jsonb,
	"display_order" integer DEFAULT 0,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "payment_methods_config" (
	"id" serial PRIMARY KEY NOT NULL,
	"method_type" varchar(50) NOT NULL,
	"method_name" varchar(255) NOT NULL,
	"method_name_arabic" varchar(255) NOT NULL,
	"is_active" boolean DEFAULT true,
	"priority" integer DEFAULT 0,
	"zain_cash_phone_number" varchar(50),
	"zain_cash_account_name" varchar(255),
	"exchange_office_name" varchar(255),
	"exchange_office_phone" varchar(50),
	"exchange_office_address" text,
	"instructions" text,
	"instructions_arabic" text,
	"fees" numeric(10, 2) DEFAULT '0.00',
	"min_amount" numeric(10, 2),
	"max_amount" numeric(10, 2),
	"metadata" jsonb DEFAULT '{}'::jsonb,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "payment_settings" (
	"id" serial PRIMARY KEY NOT NULL,
	"zain_cash_enabled" boolean DEFAULT true,
	"zain_cash_phone_number" varchar(20),
	"zain_cash_account_name" varchar(255),
	"zain_cash_qr_code_url" text,
	"zain_cash_merchant_id" varchar(255),
	"zain_cash_secret" text,
	"zain_cash_test_mode" boolean DEFAULT true,
	"cash_enabled" boolean DEFAULT true,
	"cash_instructions" text,
	"cash_instructions_arabic" text,
	"stripe_enabled" boolean DEFAULT false,
	"stripe_publishable_key" text,
	"stripe_secret_key" text,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "permissions" (
	"id" serial PRIMARY KEY NOT NULL,
	"resource" varchar(100) NOT NULL,
	"action" varchar(100) NOT NULL,
	"name" varchar(100) NOT NULL,
	"arabic_name" varchar(100) NOT NULL,
	"description" text,
	"arabic_description" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "platform_commissions" (
	"id" serial PRIMARY KEY NOT NULL,
	"order_id" integer NOT NULL,
	"supplier_id" integer NOT NULL,
	"order_total" numeric(10, 2) NOT NULL,
	"commission_rate" numeric(5, 2) NOT NULL,
	"commission_amount" numeric(10, 2) NOT NULL,
	"status" varchar(50) DEFAULT 'pending',
	"paid_at" timestamp,
	"notes" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "platform_settings" (
	"id" serial PRIMARY KEY NOT NULL,
	"key" varchar(100) NOT NULL,
	"value" text,
	"category" varchar(50) NOT NULL,
	"description" text,
	"is_public" boolean DEFAULT false,
	"data_type" varchar(50) DEFAULT 'string',
	"updated_by" integer,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "platform_settings_key_unique" UNIQUE("key")
);
--> statement-breakpoint
CREATE TABLE "products" (
	"id" serial PRIMARY KEY NOT NULL,
	"supplier_id" integer NOT NULL,
	"category_id" integer NOT NULL,
	"brand_id" integer,
	"name" varchar(255) NOT NULL,
	"arabic_name" varchar(255) NOT NULL,
	"slug" varchar(255) NOT NULL,
	"description" text,
	"arabic_description" text,
	"sku" varchar(100) NOT NULL,
	"barcode" varchar(100),
	"price" numeric(10, 2) NOT NULL,
	"original_price" numeric(10, 2),
	"discount" integer DEFAULT 0,
	"stock_quantity" integer DEFAULT 0,
	"min_order_quantity" integer DEFAULT 1,
	"max_order_quantity" integer,
	"weight" varchar(50),
	"dimensions" varchar(100),
	"image" text NOT NULL,
	"images" jsonb DEFAULT '[]'::jsonb,
	"features" jsonb DEFAULT '[]'::jsonb,
	"arabic_features" jsonb DEFAULT '[]'::jsonb,
	"specifications" jsonb DEFAULT '{}'::jsonb,
	"arabic_specifications" jsonb DEFAULT '{}'::jsonb,
	"tags" jsonb DEFAULT '[]'::jsonb,
	"arabic_tags" jsonb DEFAULT '[]'::jsonb,
	"warranty" varchar(100),
	"certification" jsonb DEFAULT '[]'::jsonb,
	"country_of_origin" varchar(100),
	"rating" numeric(3, 2) DEFAULT '0.00',
	"review_count" integer DEFAULT 0,
	"view_count" integer DEFAULT 0,
	"order_count" integer DEFAULT 0,
	"is_featured" boolean DEFAULT false,
	"is_new" boolean DEFAULT false,
	"is_active" boolean DEFAULT true,
	"free_shipping" boolean DEFAULT false,
	"estimated_days" varchar(50),
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "products_slug_unique" UNIQUE("slug"),
	CONSTRAINT "products_sku_unique" UNIQUE("sku")
);
--> statement-breakpoint
CREATE TABLE "promotional_cards" (
	"id" serial PRIMARY KEY NOT NULL,
	"title" varchar(255) NOT NULL,
	"arabic_title" varchar(255) NOT NULL,
	"description" text,
	"arabic_description" text,
	"image" text,
	"images" jsonb DEFAULT '[]'::jsonb,
	"tags" jsonb DEFAULT '[]'::jsonb,
	"arabic_tags" jsonb DEFAULT '[]'::jsonb,
	"display_type" varchar(50) DEFAULT 'card' NOT NULL,
	"target_section" jsonb DEFAULT '[]'::jsonb,
	"link_url" text,
	"button_text" varchar(100),
	"arabic_button_text" varchar(100),
	"supplier_id" integer,
	"discount_percentage" integer,
	"priority" integer DEFAULT 0,
	"start_date" timestamp NOT NULL,
	"end_date" timestamp NOT NULL,
	"is_active" boolean DEFAULT true,
	"views" integer DEFAULT 0,
	"clicks" integer DEFAULT 0,
	"conversions" integer DEFAULT 0,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "promotions" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" varchar(255) NOT NULL,
	"arabic_name" varchar(255) NOT NULL,
	"discount_percentage" integer NOT NULL,
	"start_date" timestamp NOT NULL,
	"end_date" timestamp NOT NULL,
	"plan_ids" jsonb DEFAULT '[]'::jsonb,
	"is_active" boolean DEFAULT true,
	"usage_count" integer DEFAULT 0,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "renewal_reminders" (
	"id" serial PRIMARY KEY NOT NULL,
	"clinic_id" integer NOT NULL,
	"reminder_type" varchar(50) NOT NULL,
	"sent_at" timestamp,
	"status" varchar(50) DEFAULT 'pending',
	"expiry_date" timestamp NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "reviews" (
	"id" serial PRIMARY KEY NOT NULL,
	"product_id" integer NOT NULL,
	"user_id" integer NOT NULL,
	"order_id" integer,
	"rating" integer NOT NULL,
	"title" varchar(255),
	"comment" text,
	"images" jsonb DEFAULT '[]'::jsonb,
	"is_verified" boolean DEFAULT false,
	"is_published" boolean DEFAULT true,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "role_permissions" (
	"id" serial PRIMARY KEY NOT NULL,
	"role_id" integer NOT NULL,
	"permission_id" integer NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "roles" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" varchar(100) NOT NULL,
	"arabic_name" varchar(100) NOT NULL,
	"description" text,
	"arabic_description" text,
	"level" integer NOT NULL,
	"is_system" boolean DEFAULT false,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "roles_name_unique" UNIQUE("name")
);
--> statement-breakpoint
CREATE TABLE "staff" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" integer,
	"clinic_id" integer NOT NULL,
	"role_id" integer,
	"name" varchar(255) NOT NULL,
	"arabic_name" varchar(255) NOT NULL,
	"username" varchar(100),
	"password" varchar(255),
	"role" varchar(100) NOT NULL,
	"arabic_role" varchar(100),
	"specialization" varchar(255),
	"arabic_specialization" varchar(255),
	"email" varchar(255),
	"phone" varchar(50),
	"avatar" text,
	"license_number" varchar(100),
	"experience" integer DEFAULT 0,
	"join_date" timestamp,
	"status" varchar(50) DEFAULT 'active',
	"salary" numeric(10, 2),
	"working_hours" jsonb DEFAULT '{}'::jsonb,
	"permissions" jsonb DEFAULT '[]'::jsonb,
	"can_access_sections" jsonb DEFAULT '[]'::jsonb,
	"is_owner" boolean DEFAULT false,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "staff_username_unique" UNIQUE("username")
);
--> statement-breakpoint
CREATE TABLE "staff_reminders" (
	"id" serial PRIMARY KEY NOT NULL,
	"clinic_id" integer NOT NULL,
	"from_staff_id" integer NOT NULL,
	"to_staff_id" integer NOT NULL,
	"title" varchar(255) NOT NULL,
	"description" text,
	"reminder_time" timestamp NOT NULL,
	"reminder_type" varchar(50) DEFAULT 'general' NOT NULL,
	"status" varchar(20) DEFAULT 'pending' NOT NULL,
	"snoozed_until" timestamp,
	"acknowledged_at" timestamp,
	"related_entity_id" varchar,
	"related_entity_type" varchar(50),
	"related_appointment_id" varchar,
	"metadata" jsonb DEFAULT '{}'::jsonb,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "staff_tasks" (
	"id" serial PRIMARY KEY NOT NULL,
	"clinic_id" integer NOT NULL,
	"from_staff_id" integer NOT NULL,
	"to_staff_id" integer NOT NULL,
	"title" varchar(255) NOT NULL,
	"description" text,
	"priority" varchar(20) DEFAULT 'medium' NOT NULL,
	"status" varchar(20) DEFAULT 'pending' NOT NULL,
	"task_type" varchar(50) DEFAULT 'general' NOT NULL,
	"related_entity_id" varchar,
	"related_entity_type" varchar(50),
	"due_date" timestamp,
	"completed_at" timestamp,
	"rejection_reason" text,
	"metadata" jsonb DEFAULT '{}'::jsonb,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "stripe_customers" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" integer NOT NULL,
	"stripe_customer_id" varchar(255) NOT NULL,
	"email" varchar(255) NOT NULL,
	"name" varchar(255),
	"phone" varchar(50),
	"metadata" jsonb DEFAULT '{}'::jsonb,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "stripe_customers_user_id_unique" UNIQUE("user_id"),
	CONSTRAINT "stripe_customers_stripe_customer_id_unique" UNIQUE("stripe_customer_id")
);
--> statement-breakpoint
CREATE TABLE "stripe_payment_intents" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" integer NOT NULL,
	"stripe_payment_intent_id" varchar(255) NOT NULL,
	"stripe_customer_id" varchar(255),
	"amount_iqd" numeric(10, 2) NOT NULL,
	"amount_usd" numeric(10, 2) NOT NULL,
	"exchange_rate" numeric(10, 4) NOT NULL,
	"currency" varchar(10) DEFAULT 'usd',
	"status" varchar(50) NOT NULL,
	"payment_method" varchar(100),
	"description" text,
	"receipt_email" varchar(255),
	"metadata" jsonb DEFAULT '{}'::jsonb,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "stripe_payment_intents_stripe_payment_intent_id_unique" UNIQUE("stripe_payment_intent_id")
);
--> statement-breakpoint
CREATE TABLE "stripe_subscriptions" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" integer NOT NULL,
	"clinic_id" integer,
	"stripe_subscription_id" varchar(255) NOT NULL,
	"stripe_customer_id" varchar(255) NOT NULL,
	"stripe_price_id" varchar(255) NOT NULL,
	"status" varchar(50) NOT NULL,
	"plan_type" varchar(50) NOT NULL,
	"amount_iqd" numeric(10, 2) NOT NULL,
	"amount_usd" numeric(10, 2) NOT NULL,
	"exchange_rate" numeric(10, 4) NOT NULL,
	"interval" varchar(50) NOT NULL,
	"current_period_start" timestamp NOT NULL,
	"current_period_end" timestamp NOT NULL,
	"cancel_at_period_end" boolean DEFAULT false,
	"canceled_at" timestamp,
	"trial_start" timestamp,
	"trial_end" timestamp,
	"metadata" jsonb DEFAULT '{}'::jsonb,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "stripe_subscriptions_stripe_subscription_id_unique" UNIQUE("stripe_subscription_id")
);
--> statement-breakpoint
CREATE TABLE "subscription_analytics" (
	"id" serial PRIMARY KEY NOT NULL,
	"clinic_id" integer NOT NULL,
	"month" varchar(7) NOT NULL,
	"patients_count" integer DEFAULT 0,
	"ai_usage_count" integer DEFAULT 0,
	"reminders_count" integer DEFAULT 0,
	"suggestions_count" integer DEFAULT 0,
	"appointments_count" integer DEFAULT 0,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "subscription_badges" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" varchar(100) NOT NULL,
	"arabic_name" varchar(100) NOT NULL,
	"description" text,
	"arabic_description" text,
	"icon" varchar(255),
	"color" varchar(50),
	"plan_id" integer,
	"is_active" boolean DEFAULT true,
	"display_order" integer DEFAULT 0,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "subscription_payments" (
	"id" serial PRIMARY KEY NOT NULL,
	"payment_number" varchar(100) NOT NULL,
	"clinic_id" integer NOT NULL,
	"user_id" integer NOT NULL,
	"subscription_type" varchar(100) NOT NULL,
	"amount" numeric(10, 2) NOT NULL,
	"duration" integer NOT NULL,
	"payment_method" varchar(50) NOT NULL,
	"zain_cash_phone_number" varchar(50),
	"zain_cash_transaction_ref" varchar(255),
	"sender_name" varchar(255),
	"exchange_office_name" varchar(255),
	"deposit_receipt_number" varchar(255),
	"status" varchar(50) DEFAULT 'pending_verification',
	"verification_status" varchar(50) DEFAULT 'pending',
	"verified_by" integer,
	"verified_at" timestamp,
	"verification_notes" text,
	"rejection_reason" text,
	"activated_at" timestamp,
	"expires_at" timestamp,
	"attachments" jsonb DEFAULT '[]'::jsonb,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "subscription_payments_payment_number_unique" UNIQUE("payment_number")
);
--> statement-breakpoint
CREATE TABLE "subscription_plans" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" varchar(255) NOT NULL,
	"arabic_name" varchar(255) NOT NULL,
	"description" text,
	"arabic_description" text,
	"price" numeric(10, 2) NOT NULL,
	"duration_months" integer NOT NULL,
	"features" jsonb DEFAULT '[]'::jsonb,
	"arabic_features" jsonb DEFAULT '[]'::jsonb,
	"can_be_promoted" boolean DEFAULT false,
	"max_priority_level" integer DEFAULT 0,
	"show_in_top" boolean DEFAULT false,
	"max_monthly_appearances" integer,
	"is_active" boolean DEFAULT true,
	"display_order" integer DEFAULT 0,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "supplier_analytics" (
	"id" serial PRIMARY KEY NOT NULL,
	"supplier_id" integer NOT NULL,
	"month" varchar(7) NOT NULL,
	"total_orders" integer DEFAULT 0,
	"total_revenue" numeric(10, 2) DEFAULT '0.00',
	"total_commission" numeric(10, 2) DEFAULT '0.00',
	"net_revenue" numeric(10, 2) DEFAULT '0.00',
	"avg_order_value" numeric(10, 2) DEFAULT '0.00',
	"new_customers" integer DEFAULT 0,
	"products_sold" integer DEFAULT 0,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "supplier_approvals" (
	"id" serial PRIMARY KEY NOT NULL,
	"supplier_id" integer NOT NULL,
	"status" varchar(50) DEFAULT 'pending',
	"reviewed_by" integer,
	"reviewed_at" timestamp,
	"rejection_reason" text,
	"arabic_rejection_reason" text,
	"notes" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "supplier_badges" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" varchar(100) NOT NULL,
	"arabic_name" varchar(100) NOT NULL,
	"slug" varchar(100) NOT NULL,
	"description" text,
	"arabic_description" text,
	"icon" varchar(100),
	"color" varchar(50) DEFAULT 'blue',
	"background_color" varchar(50),
	"text_color" varchar(50),
	"order" integer DEFAULT 0,
	"is_active" boolean DEFAULT true,
	"requires_approval" boolean DEFAULT true,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "supplier_badges_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
CREATE TABLE "supplier_messages" (
	"id" serial PRIMARY KEY NOT NULL,
	"conversation_id" varchar(100) NOT NULL,
	"supplier_id" integer NOT NULL,
	"customer_id" integer NOT NULL,
	"sender_id" integer NOT NULL,
	"sender_type" varchar(50) NOT NULL,
	"message" text NOT NULL,
	"attachments" jsonb DEFAULT '[]'::jsonb,
	"is_read" boolean DEFAULT false,
	"read_at" timestamp,
	"order_id" integer,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "supplier_notifications" (
	"id" serial PRIMARY KEY NOT NULL,
	"supplier_id" integer NOT NULL,
	"type" varchar(50) NOT NULL,
	"title" varchar(255) NOT NULL,
	"title_arabic" varchar(255) NOT NULL,
	"message" text NOT NULL,
	"message_arabic" text NOT NULL,
	"is_read" boolean DEFAULT false,
	"read_at" timestamp,
	"metadata" jsonb DEFAULT '{}'::jsonb,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "supplier_sales_reports" (
	"id" serial PRIMARY KEY NOT NULL,
	"supplier_id" integer NOT NULL,
	"report_period" varchar(50) NOT NULL,
	"period_start" timestamp NOT NULL,
	"period_end" timestamp NOT NULL,
	"total_orders" integer DEFAULT 0,
	"total_revenue" numeric(12, 2) DEFAULT '0.00',
	"total_commission" numeric(12, 2) DEFAULT '0.00',
	"avg_order_value" numeric(10, 2) DEFAULT '0.00',
	"top_products" jsonb DEFAULT '[]'::jsonb,
	"payment_methods" jsonb DEFAULT '{}'::jsonb,
	"order_statuses" jsonb DEFAULT '{}'::jsonb,
	"generated_at" timestamp DEFAULT now() NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "suppliers" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" integer NOT NULL,
	"company_name" varchar(255) NOT NULL,
	"arabic_company_name" varchar(255),
	"email" varchar(255),
	"phone" varchar(50),
	"description" text,
	"arabic_description" text,
	"logo" text,
	"cover_image" text,
	"speciality" varchar(255),
	"location" varchar(255),
	"established" integer,
	"verified" boolean DEFAULT false,
	"is_approved" boolean DEFAULT false,
	"approval_note" text,
	"approved_at" timestamp,
	"approved_by" integer,
	"rating" numeric(3, 2) DEFAULT '0.00',
	"total_reviews" integer DEFAULT 0,
	"total_products" integer DEFAULT 0,
	"total_orders" integer DEFAULT 0,
	"website" varchar(255),
	"badges" jsonb DEFAULT '[]'::jsonb,
	"services" jsonb DEFAULT '[]'::jsonb,
	"certifications" jsonb DEFAULT '[]'::jsonb,
	"response_time" varchar(100),
	"whatsapp" varchar(50),
	"province" varchar(100),
	"union_endorsed" boolean DEFAULT false,
	"union_endorsed_at" timestamp,
	"union_certificate_number" varchar(100),
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "support_tickets" (
	"id" serial PRIMARY KEY NOT NULL,
	"ticket_number" varchar(50) NOT NULL,
	"clinic_id" integer NOT NULL,
	"subject" varchar(255) NOT NULL,
	"description" text NOT NULL,
	"priority" varchar(20) DEFAULT 'medium',
	"status" varchar(50) DEFAULT 'open',
	"assigned_to" integer,
	"resolved_at" timestamp,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "support_tickets_ticket_number_unique" UNIQUE("ticket_number")
);
--> statement-breakpoint
CREATE TABLE "usage_tracking" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" integer NOT NULL,
	"clinic_id" integer,
	"tracking_date" timestamp DEFAULT now() NOT NULL,
	"patients_count" integer DEFAULT 0,
	"patients_added_today" integer DEFAULT 0,
	"ai_usage_today" integer DEFAULT 0,
	"ai_usage_total" integer DEFAULT 0,
	"clinics_count" integer DEFAULT 0,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "user_badges" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" integer NOT NULL,
	"badge_id" integer NOT NULL,
	"earned_at" timestamp DEFAULT now() NOT NULL,
	"is_visible" boolean DEFAULT true,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "user_permissions" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" integer NOT NULL,
	"permission_id" integer NOT NULL,
	"clinic_id" integer,
	"granted_by" integer,
	"granted_at" timestamp DEFAULT now() NOT NULL,
	"expires_at" timestamp,
	"notes" text,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "user_rewards" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" integer NOT NULL,
	"reward_type" varchar(100) NOT NULL,
	"reward_value" integer NOT NULL,
	"reward_description" text,
	"arabic_description" text,
	"plan_id" integer,
	"is_active" boolean DEFAULT true,
	"is_used" boolean DEFAULT false,
	"used_at" timestamp,
	"expires_at" timestamp,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "user_roles" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" integer NOT NULL,
	"role_id" integer NOT NULL,
	"clinic_id" integer,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "users" (
	"id" serial PRIMARY KEY NOT NULL,
	"supabase_id" varchar(255),
	"email" varchar(255) NOT NULL,
	"password" varchar(255) NOT NULL,
	"name" varchar(255) NOT NULL,
	"arabic_name" varchar(255),
	"role" varchar(50) DEFAULT 'customer' NOT NULL,
	"phone" varchar(50),
	"address" text,
	"city" varchar(100),
	"province" varchar(100),
	"avatar" text,
	"verified" boolean DEFAULT false,
	"union_endorsed" boolean DEFAULT false,
	"union_endorsed_at" timestamp,
	"union_certificate_number" varchar(100),
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "users_supabase_id_unique" UNIQUE("supabase_id"),
	CONSTRAINT "users_email_unique" UNIQUE("email")
);
--> statement-breakpoint
ALTER TABLE "api_keys" ADD CONSTRAINT "api_keys_service_id_external_api_services_id_fk" FOREIGN KEY ("service_id") REFERENCES "public"."external_api_services"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "api_keys" ADD CONSTRAINT "api_keys_created_by_users_id_fk" FOREIGN KEY ("created_by") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "cart" ADD CONSTRAINT "cart_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "cart" ADD CONSTRAINT "cart_product_id_products_id_fk" FOREIGN KEY ("product_id") REFERENCES "public"."products"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "clinic_payments" ADD CONSTRAINT "clinic_payments_clinic_id_clinics_id_fk" FOREIGN KEY ("clinic_id") REFERENCES "public"."clinics"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "clinic_payments" ADD CONSTRAINT "clinic_payments_plan_id_subscription_plans_id_fk" FOREIGN KEY ("plan_id") REFERENCES "public"."subscription_plans"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "clinic_payments" ADD CONSTRAINT "clinic_payments_coupon_id_coupons_id_fk" FOREIGN KEY ("coupon_id") REFERENCES "public"."coupons"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "clinics" ADD CONSTRAINT "clinics_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "commission_invoices" ADD CONSTRAINT "commission_invoices_supplier_id_suppliers_id_fk" FOREIGN KEY ("supplier_id") REFERENCES "public"."suppliers"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "commission_settings" ADD CONSTRAINT "commission_settings_supplier_id_suppliers_id_fk" FOREIGN KEY ("supplier_id") REFERENCES "public"."suppliers"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "community_3d_models" ADD CONSTRAINT "community_3d_models_added_by_users_id_fk" FOREIGN KEY ("added_by") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "community_comment_likes" ADD CONSTRAINT "community_comment_likes_comment_id_community_comments_id_fk" FOREIGN KEY ("comment_id") REFERENCES "public"."community_comments"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "community_comment_likes" ADD CONSTRAINT "community_comment_likes_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "community_comments" ADD CONSTRAINT "community_comments_post_id_community_posts_id_fk" FOREIGN KEY ("post_id") REFERENCES "public"."community_posts"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "community_comments" ADD CONSTRAINT "community_comments_author_id_users_id_fk" FOREIGN KEY ("author_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "community_course_enrollments" ADD CONSTRAINT "community_course_enrollments_course_id_community_courses_id_fk" FOREIGN KEY ("course_id") REFERENCES "public"."community_courses"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "community_course_enrollments" ADD CONSTRAINT "community_course_enrollments_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "community_courses" ADD CONSTRAINT "community_courses_created_by_users_id_fk" FOREIGN KEY ("created_by") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "community_educational_content" ADD CONSTRAINT "community_educational_content_author_id_users_id_fk" FOREIGN KEY ("author_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "community_educational_content" ADD CONSTRAINT "community_educational_content_approved_by_users_id_fk" FOREIGN KEY ("approved_by") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "community_events" ADD CONSTRAINT "community_events_created_by_users_id_fk" FOREIGN KEY ("created_by") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "community_follows" ADD CONSTRAINT "community_follows_follower_id_users_id_fk" FOREIGN KEY ("follower_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "community_follows" ADD CONSTRAINT "community_follows_followed_id_users_id_fk" FOREIGN KEY ("followed_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "community_group_members" ADD CONSTRAINT "community_group_members_group_id_community_groups_id_fk" FOREIGN KEY ("group_id") REFERENCES "public"."community_groups"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "community_group_members" ADD CONSTRAINT "community_group_members_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "community_groups" ADD CONSTRAINT "community_groups_creator_id_users_id_fk" FOREIGN KEY ("creator_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "community_moderators" ADD CONSTRAINT "community_moderators_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "community_moderators" ADD CONSTRAINT "community_moderators_assigned_by_users_id_fk" FOREIGN KEY ("assigned_by") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "community_post_likes" ADD CONSTRAINT "community_post_likes_post_id_community_posts_id_fk" FOREIGN KEY ("post_id") REFERENCES "public"."community_posts"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "community_post_likes" ADD CONSTRAINT "community_post_likes_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "community_post_saves" ADD CONSTRAINT "community_post_saves_post_id_community_posts_id_fk" FOREIGN KEY ("post_id") REFERENCES "public"."community_posts"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "community_post_saves" ADD CONSTRAINT "community_post_saves_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "community_posts" ADD CONSTRAINT "community_posts_author_id_users_id_fk" FOREIGN KEY ("author_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "community_trusted_sources" ADD CONSTRAINT "community_trusted_sources_added_by_users_id_fk" FOREIGN KEY ("added_by") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "coupon_usage" ADD CONSTRAINT "coupon_usage_coupon_id_coupons_id_fk" FOREIGN KEY ("coupon_id") REFERENCES "public"."coupons"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "coupon_usage" ADD CONSTRAINT "coupon_usage_clinic_id_clinics_id_fk" FOREIGN KEY ("clinic_id") REFERENCES "public"."clinics"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "coupon_usage" ADD CONSTRAINT "coupon_usage_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "coupon_usage" ADD CONSTRAINT "coupon_usage_payment_id_clinic_payments_id_fk" FOREIGN KEY ("payment_id") REFERENCES "public"."clinic_payments"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "delivery_history" ADD CONSTRAINT "delivery_history_delivery_id_order_deliveries_id_fk" FOREIGN KEY ("delivery_id") REFERENCES "public"."order_deliveries"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "external_api_services" ADD CONSTRAINT "external_api_services_created_by_users_id_fk" FOREIGN KEY ("created_by") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "external_database_connections" ADD CONSTRAINT "external_database_connections_created_by_users_id_fk" FOREIGN KEY ("created_by") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "favorites" ADD CONSTRAINT "favorites_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "favorites" ADD CONSTRAINT "favorites_product_id_products_id_fk" FOREIGN KEY ("product_id") REFERENCES "public"."products"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "integration_logs" ADD CONSTRAINT "integration_logs_service_id_external_api_services_id_fk" FOREIGN KEY ("service_id") REFERENCES "public"."external_api_services"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "manual_payment_reviews" ADD CONSTRAINT "manual_payment_reviews_submitted_by_users_id_fk" FOREIGN KEY ("submitted_by") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "manual_payment_reviews" ADD CONSTRAINT "manual_payment_reviews_assigned_to_users_id_fk" FOREIGN KEY ("assigned_to") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "manual_payment_reviews" ADD CONSTRAINT "manual_payment_reviews_reviewed_by_users_id_fk" FOREIGN KEY ("reviewed_by") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "order_deliveries" ADD CONSTRAINT "order_deliveries_order_id_orders_id_fk" FOREIGN KEY ("order_id") REFERENCES "public"."orders"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "order_deliveries" ADD CONSTRAINT "order_deliveries_supplier_id_suppliers_id_fk" FOREIGN KEY ("supplier_id") REFERENCES "public"."suppliers"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "order_items" ADD CONSTRAINT "order_items_order_id_orders_id_fk" FOREIGN KEY ("order_id") REFERENCES "public"."orders"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "order_items" ADD CONSTRAINT "order_items_product_id_products_id_fk" FOREIGN KEY ("product_id") REFERENCES "public"."products"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "order_items" ADD CONSTRAINT "order_items_supplier_id_suppliers_id_fk" FOREIGN KEY ("supplier_id") REFERENCES "public"."suppliers"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "order_returns" ADD CONSTRAINT "order_returns_order_id_orders_id_fk" FOREIGN KEY ("order_id") REFERENCES "public"."orders"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "order_returns" ADD CONSTRAINT "order_returns_order_item_id_order_items_id_fk" FOREIGN KEY ("order_item_id") REFERENCES "public"."order_items"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "order_returns" ADD CONSTRAINT "order_returns_supplier_id_suppliers_id_fk" FOREIGN KEY ("supplier_id") REFERENCES "public"."suppliers"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "order_returns" ADD CONSTRAINT "order_returns_customer_id_users_id_fk" FOREIGN KEY ("customer_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "order_returns" ADD CONSTRAINT "order_returns_approved_by_users_id_fk" FOREIGN KEY ("approved_by") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "orders" ADD CONSTRAINT "orders_customer_id_users_id_fk" FOREIGN KEY ("customer_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "platform_commissions" ADD CONSTRAINT "platform_commissions_order_id_orders_id_fk" FOREIGN KEY ("order_id") REFERENCES "public"."orders"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "platform_commissions" ADD CONSTRAINT "platform_commissions_supplier_id_suppliers_id_fk" FOREIGN KEY ("supplier_id") REFERENCES "public"."suppliers"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "platform_settings" ADD CONSTRAINT "platform_settings_updated_by_users_id_fk" FOREIGN KEY ("updated_by") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "products" ADD CONSTRAINT "products_supplier_id_suppliers_id_fk" FOREIGN KEY ("supplier_id") REFERENCES "public"."suppliers"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "products" ADD CONSTRAINT "products_category_id_categories_id_fk" FOREIGN KEY ("category_id") REFERENCES "public"."categories"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "products" ADD CONSTRAINT "products_brand_id_brands_id_fk" FOREIGN KEY ("brand_id") REFERENCES "public"."brands"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "promotional_cards" ADD CONSTRAINT "promotional_cards_supplier_id_suppliers_id_fk" FOREIGN KEY ("supplier_id") REFERENCES "public"."suppliers"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "renewal_reminders" ADD CONSTRAINT "renewal_reminders_clinic_id_clinics_id_fk" FOREIGN KEY ("clinic_id") REFERENCES "public"."clinics"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "reviews" ADD CONSTRAINT "reviews_product_id_products_id_fk" FOREIGN KEY ("product_id") REFERENCES "public"."products"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "reviews" ADD CONSTRAINT "reviews_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "reviews" ADD CONSTRAINT "reviews_order_id_orders_id_fk" FOREIGN KEY ("order_id") REFERENCES "public"."orders"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "role_permissions" ADD CONSTRAINT "role_permissions_role_id_roles_id_fk" FOREIGN KEY ("role_id") REFERENCES "public"."roles"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "role_permissions" ADD CONSTRAINT "role_permissions_permission_id_permissions_id_fk" FOREIGN KEY ("permission_id") REFERENCES "public"."permissions"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "staff" ADD CONSTRAINT "staff_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "staff" ADD CONSTRAINT "staff_clinic_id_clinics_id_fk" FOREIGN KEY ("clinic_id") REFERENCES "public"."clinics"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "staff" ADD CONSTRAINT "staff_role_id_roles_id_fk" FOREIGN KEY ("role_id") REFERENCES "public"."roles"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "staff_reminders" ADD CONSTRAINT "staff_reminders_clinic_id_clinics_id_fk" FOREIGN KEY ("clinic_id") REFERENCES "public"."clinics"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "staff_reminders" ADD CONSTRAINT "staff_reminders_from_staff_id_staff_id_fk" FOREIGN KEY ("from_staff_id") REFERENCES "public"."staff"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "staff_reminders" ADD CONSTRAINT "staff_reminders_to_staff_id_staff_id_fk" FOREIGN KEY ("to_staff_id") REFERENCES "public"."staff"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "staff_tasks" ADD CONSTRAINT "staff_tasks_clinic_id_clinics_id_fk" FOREIGN KEY ("clinic_id") REFERENCES "public"."clinics"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "staff_tasks" ADD CONSTRAINT "staff_tasks_from_staff_id_staff_id_fk" FOREIGN KEY ("from_staff_id") REFERENCES "public"."staff"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "staff_tasks" ADD CONSTRAINT "staff_tasks_to_staff_id_staff_id_fk" FOREIGN KEY ("to_staff_id") REFERENCES "public"."staff"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "stripe_customers" ADD CONSTRAINT "stripe_customers_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "stripe_payment_intents" ADD CONSTRAINT "stripe_payment_intents_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "stripe_subscriptions" ADD CONSTRAINT "stripe_subscriptions_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "stripe_subscriptions" ADD CONSTRAINT "stripe_subscriptions_clinic_id_clinics_id_fk" FOREIGN KEY ("clinic_id") REFERENCES "public"."clinics"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "subscription_analytics" ADD CONSTRAINT "subscription_analytics_clinic_id_clinics_id_fk" FOREIGN KEY ("clinic_id") REFERENCES "public"."clinics"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "subscription_badges" ADD CONSTRAINT "subscription_badges_plan_id_subscription_plans_id_fk" FOREIGN KEY ("plan_id") REFERENCES "public"."subscription_plans"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "subscription_payments" ADD CONSTRAINT "subscription_payments_clinic_id_clinics_id_fk" FOREIGN KEY ("clinic_id") REFERENCES "public"."clinics"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "subscription_payments" ADD CONSTRAINT "subscription_payments_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "subscription_payments" ADD CONSTRAINT "subscription_payments_verified_by_users_id_fk" FOREIGN KEY ("verified_by") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "supplier_analytics" ADD CONSTRAINT "supplier_analytics_supplier_id_suppliers_id_fk" FOREIGN KEY ("supplier_id") REFERENCES "public"."suppliers"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "supplier_approvals" ADD CONSTRAINT "supplier_approvals_supplier_id_suppliers_id_fk" FOREIGN KEY ("supplier_id") REFERENCES "public"."suppliers"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "supplier_approvals" ADD CONSTRAINT "supplier_approvals_reviewed_by_users_id_fk" FOREIGN KEY ("reviewed_by") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "supplier_messages" ADD CONSTRAINT "supplier_messages_supplier_id_suppliers_id_fk" FOREIGN KEY ("supplier_id") REFERENCES "public"."suppliers"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "supplier_messages" ADD CONSTRAINT "supplier_messages_customer_id_users_id_fk" FOREIGN KEY ("customer_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "supplier_messages" ADD CONSTRAINT "supplier_messages_sender_id_users_id_fk" FOREIGN KEY ("sender_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "supplier_messages" ADD CONSTRAINT "supplier_messages_order_id_orders_id_fk" FOREIGN KEY ("order_id") REFERENCES "public"."orders"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "supplier_notifications" ADD CONSTRAINT "supplier_notifications_supplier_id_suppliers_id_fk" FOREIGN KEY ("supplier_id") REFERENCES "public"."suppliers"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "supplier_sales_reports" ADD CONSTRAINT "supplier_sales_reports_supplier_id_suppliers_id_fk" FOREIGN KEY ("supplier_id") REFERENCES "public"."suppliers"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "suppliers" ADD CONSTRAINT "suppliers_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "suppliers" ADD CONSTRAINT "suppliers_approved_by_users_id_fk" FOREIGN KEY ("approved_by") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "support_tickets" ADD CONSTRAINT "support_tickets_clinic_id_clinics_id_fk" FOREIGN KEY ("clinic_id") REFERENCES "public"."clinics"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "support_tickets" ADD CONSTRAINT "support_tickets_assigned_to_users_id_fk" FOREIGN KEY ("assigned_to") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "usage_tracking" ADD CONSTRAINT "usage_tracking_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "usage_tracking" ADD CONSTRAINT "usage_tracking_clinic_id_clinics_id_fk" FOREIGN KEY ("clinic_id") REFERENCES "public"."clinics"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "user_badges" ADD CONSTRAINT "user_badges_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "user_badges" ADD CONSTRAINT "user_badges_badge_id_subscription_badges_id_fk" FOREIGN KEY ("badge_id") REFERENCES "public"."subscription_badges"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "user_permissions" ADD CONSTRAINT "user_permissions_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "user_permissions" ADD CONSTRAINT "user_permissions_permission_id_permissions_id_fk" FOREIGN KEY ("permission_id") REFERENCES "public"."permissions"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "user_permissions" ADD CONSTRAINT "user_permissions_clinic_id_clinics_id_fk" FOREIGN KEY ("clinic_id") REFERENCES "public"."clinics"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "user_permissions" ADD CONSTRAINT "user_permissions_granted_by_users_id_fk" FOREIGN KEY ("granted_by") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "user_rewards" ADD CONSTRAINT "user_rewards_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "user_rewards" ADD CONSTRAINT "user_rewards_plan_id_subscription_plans_id_fk" FOREIGN KEY ("plan_id") REFERENCES "public"."subscription_plans"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "user_roles" ADD CONSTRAINT "user_roles_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "user_roles" ADD CONSTRAINT "user_roles_role_id_roles_id_fk" FOREIGN KEY ("role_id") REFERENCES "public"."roles"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "user_roles" ADD CONSTRAINT "user_roles_clinic_id_clinics_id_fk" FOREIGN KEY ("clinic_id") REFERENCES "public"."clinics"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
CREATE UNIQUE INDEX "community_follows_follower_followed_uidx" ON "community_follows" USING btree ("follower_id","followed_id");--> statement-breakpoint
CREATE UNIQUE INDEX "unique_resource_action" ON "permissions" USING btree ("resource","action");--> statement-breakpoint
CREATE UNIQUE INDEX "role_permissions_role_id_permission_id_key" ON "role_permissions" USING btree ("role_id","permission_id");--> statement-breakpoint
CREATE UNIQUE INDEX "user_permissions_user_id_permission_id_clinic_id_key" ON "user_permissions" USING btree ("user_id","permission_id","clinic_id");--> statement-breakpoint
CREATE UNIQUE INDEX "user_roles_user_id_role_id_clinic_id_key" ON "user_roles" USING btree ("user_id","role_id","clinic_id");