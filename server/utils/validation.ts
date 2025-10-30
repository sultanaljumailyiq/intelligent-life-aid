import { z, ZodError, ZodSchema } from "zod";
import { Request, Response } from "express";

// =============== Common Field Schemas ===============
export const emailSchema = z.string().trim().email().max(255);
export const passwordSchema = z.string().min(8).max(128);
export const phoneSchema = z.string().regex(/^\+?[1-9]\d{1,14}$/);
export const nameSchema = z.string().trim().min(2).max(100);
export const arabicNameSchema = z.string().trim().min(2).max(100);
export const urlSchema = z.string().url();
export const textSchema = z.string().trim().max(1000);
export const descriptionSchema = z.string().trim().min(1).max(5000);
export const priceSchema = z.number().positive();
export const idSchema = z.number().or(z.string().transform(Number));

// =============== Authentication Schemas ===============
export const authLoginSchema = z.object({
  email: emailSchema,
  password: passwordSchema,
});

export const authRegisterSchema = z.object({
  email: emailSchema,
  password: passwordSchema,
  name: nameSchema,
  arabicName: arabicNameSchema.optional(),
  phone: phoneSchema,
  province: z.string().optional(),
});

// =============== Product Schemas ===============
export const productCreateSchema = z.object({
  name: nameSchema,
  arabicName: arabicNameSchema.optional(),
  description: descriptionSchema,
  arabicDescription: descriptionSchema.optional(),
  price: priceSchema,
  cost: priceSchema.optional(),
  category: z.string().min(1),
  subcategory: z.string().optional(),
  supplierId: idSchema.optional(),
  sku: z.string().optional(),
  stock: z.number().int().nonnegative(),
  images: z.array(z.string().url()).optional(),
  isActive: z.boolean().optional().default(true),
});

export const productUpdateSchema = productCreateSchema.partial();

// =============== Order Schemas ===============
export const orderItemSchema = z.object({
  productId: idSchema,
  quantity: z.number().int().positive(),
  price: priceSchema,
  notes: z.string().optional(),
});

export const orderCreateSchema = z.object({
  items: z.array(orderItemSchema).min(1),
  supplierId: idSchema.optional(),
  shippingAddress: z.object({
    governorate: z.string().min(1),
    city: z.string().min(1),
    street: z.string().optional(),
    buildingNumber: z.string().optional(),
    phone: phoneSchema,
  }).optional(),
  notes: z.string().optional(),
  paymentMethod: z.string().optional(),
});

export const orderStatusUpdateSchema = z.object({
  status: z.enum(["pending", "confirmed", "processing", "shipped", "delivered", "cancelled"]),
  notes: z.string().optional(),
});

// =============== Subscription Schemas ===============
export const subscriptionCreateSchema = z.object({
  planId: idSchema,
  startDate: z.string().datetime().optional(),
  paymentMethodId: idSchema.optional(),
  autoRenew: z.boolean().optional().default(true),
});

export const subscriptionUpdateSchema = z.object({
  autoRenew: z.boolean().optional(),
  status: z.enum(["active", "paused", "cancelled"]).optional(),
});

// =============== Staff/User Schemas ===============
export const staffCreateSchema = z.object({
  email: emailSchema,
  password: passwordSchema,
  name: nameSchema,
  arabicName: arabicNameSchema.optional(),
  phone: phoneSchema,
  role: z.enum(["doctor", "nurse", "receptionist", "manager"]),
  clinicId: idSchema,
  specialization: z.string().optional(),
  licenseNumber: z.string().optional(),
});

export const staffUpdateSchema = staffCreateSchema.partial().omit({ email: true, password: true });

export const userProfileUpdateSchema = z.object({
  name: nameSchema.optional(),
  arabicName: arabicNameSchema.optional(),
  phone: phoneSchema.optional(),
  avatar: urlSchema.optional(),
  province: z.string().optional(),
  companyName: z.string().optional(),
  businessLicense: z.string().optional(),
});

// =============== Clinic Schemas ===============
export const clinicCreateSchema = z.object({
  name: nameSchema,
  arabicName: arabicNameSchema.optional(),
  description: descriptionSchema.optional(),
  phone: phoneSchema,
  email: emailSchema.optional(),
  governorate: z.string().min(1),
  city: z.string().min(1),
  address: z.string().optional(),
  latitude: z.number().optional(),
  longitude: z.number().optional(),
  specialties: z.array(z.string()).optional(),
  workingHours: z.object({
    openTime: z.string().optional(),
    closeTime: z.string().optional(),
    daysOpen: z.array(z.string()).optional(),
  }).optional(),
  logo: urlSchema.optional(),
  banner: urlSchema.optional(),
});

export const clinicUpdateSchema = clinicCreateSchema.partial();

// =============== Payment Schemas ===============
export const paymentMethodSchema = z.object({
  type: z.enum(["stripe", "zain_cash", "cash_agents", "bank_transfer", "rafidain"]),
  cardNumber: z.string().optional(),
  expiryDate: z.string().optional(),
  cvv: z.string().optional(),
  accountNumber: z.string().optional(),
  bankName: z.string().optional(),
});

export const paymentVerificationSchema = z.object({
  orderId: idSchema,
  transactionId: z.string(),
  amount: priceSchema,
  paymentMethod: z.string(),
  status: z.enum(["pending", "verified", "failed"]).optional(),
  notes: z.string().optional(),
});

// =============== Community Schemas ===============
export const communityPostSchema = z.object({
  title: z.string().min(1).max(500),
  content: z.string().min(1).max(10000),
  category: z.string().min(1),
  tags: z.array(z.string()).optional(),
  images: z.array(z.string().url()).optional(),
  isPublished: z.boolean().optional().default(false),
});

export const communityCommentSchema = z.object({
  content: z.string().min(1).max(5000),
  postId: idSchema,
  parentCommentId: idSchema.optional(),
});

// =============== Validation Helper ===============

export type ValidationError = {
  status: number;
  message: string;
  errors?: Record<string, string[]>;
};

/**
 * Validates request data against a Zod schema
 * @param data - Data to validate
 * @param schema - Zod schema
 * @returns Validated data or throws ValidationError
 */
export function validateRequest<T>(data: unknown, schema: ZodSchema): T {
  try {
    return schema.parse(data) as T;
  } catch (error) {
    if (error instanceof ZodError) {
      const errors: Record<string, string[]> = {};
      for (const issue of error.issues) {
        const path = issue.path.join(".");
        if (!errors[path]) {
          errors[path] = [];
        }
        errors[path].push(issue.message);
      }
      throw {
        status: 400,
        message: "Validation failed",
        errors,
      } as ValidationError;
    }
    throw error;
  }
}

/**
 * Middleware to handle validation errors
 */
export function handleValidationError(
  error: unknown,
  res: Response
): boolean {
  if (
    error &&
    typeof error === "object" &&
    "status" in error &&
    "message" in error
  ) {
    const validationError = error as ValidationError;
    if (validationError.status === 400) {
      res.status(400).json({
        error: validationError.message,
        details: validationError.errors || [],
      });
      return true;
    }
  }
  return false;
}

export type AuthLoginData = z.infer<typeof authLoginSchema>;
export type AuthRegisterData = z.infer<typeof authRegisterSchema>;
export type ProductCreateData = z.infer<typeof productCreateSchema>;
export type ProductUpdateData = z.infer<typeof productUpdateSchema>;
export type OrderCreateData = z.infer<typeof orderCreateSchema>;
export type OrderStatusUpdateData = z.infer<typeof orderStatusUpdateSchema>;
export type SubscriptionCreateData = z.infer<typeof subscriptionCreateSchema>;
export type SubscriptionUpdateData = z.infer<typeof subscriptionUpdateSchema>;
export type StaffCreateData = z.infer<typeof staffCreateSchema>;
export type StaffUpdateData = z.infer<typeof staffUpdateSchema>;
export type UserProfileUpdateData = z.infer<typeof userProfileUpdateSchema>;
export type ClinicCreateData = z.infer<typeof clinicCreateSchema>;
export type ClinicUpdateData = z.infer<typeof clinicUpdateSchema>;
export type PaymentMethodData = z.infer<typeof paymentMethodSchema>;
export type PaymentVerificationData = z.infer<typeof paymentVerificationSchema>;
export type CommunityPostData = z.infer<typeof communityPostSchema>;
export type CommunityCommentData = z.infer<typeof communityCommentSchema>;
