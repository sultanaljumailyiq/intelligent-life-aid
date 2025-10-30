import { Router, Request, Response } from "express";
import { asyncHandler, ApiError, ErrorCode, sendSuccess } from "../middleware/errorHandler";
import { supabaseAdmin } from "../config/supabase";

const router = Router();

/**
 * Create admin user in Supabase
 * POST /api/setup/create-admin
 * Body: { email?: string, password?: string }
 */
const createAdminUser = asyncHandler(async (req: Request, res: Response) => {
  const email = req.body.email || "admin@platform.com";
  const password = req.body.password || "admin123";

  if (!email || !password) {
    throw new ApiError(
      400,
      ErrorCode.BAD_REQUEST,
      "Email and password are required"
    );
  }

  if (!supabaseAdmin) {
    throw new ApiError(
      500,
      ErrorCode.SERVICE_UNAVAILABLE,
      "Supabase admin client not configured"
    );
  }

  try {
    // Check if user already exists
    const { data: existingUsers } = await supabaseAdmin.auth.admin.listUsers();
    const userExists = existingUsers?.users?.some(u => u.email === email);

    if (userExists) {
      throw new ApiError(
        409,
        ErrorCode.CONFLICT,
        `User with email ${email} already exists`
      );
    }

    // Create user in Supabase Auth
    const { data: authData, error: authError } = await supabaseAdmin.auth.admin.createUser({
      email: email,
      password: password,
      email_confirm: true,
      user_metadata: {
        role: "app_owner",
        name: "Platform Admin",
        arabicName: "مدير النظام",
        avatar: null,
      },
    });

    if (authError) {
      throw new ApiError(
        400,
        ErrorCode.BAD_REQUEST,
        `Failed to create admin user: ${authError.message}`
      );
    }

    if (!authData?.user?.id) {
      throw new ApiError(
        500,
        ErrorCode.INTERNAL_ERROR,
        "User created but no ID returned"
      );
    }

    return sendSuccess(
      res,
      {
        message: "Admin user created successfully",
        userId: authData.user.id,
        email: authData.user.email,
        role: "app_owner",
      },
      201
    );
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }

    console.error("Unexpected error creating admin user:", error);
    throw new ApiError(
      500,
      ErrorCode.INTERNAL_ERROR,
      "An unexpected error occurred while creating admin user"
    );
  }
});

/**
 * Health check for setup endpoint
 * GET /api/setup/health
 */
const setupHealth = asyncHandler(async (_req: Request, res: Response) => {
  const isSupabaseConfigured = Boolean(supabaseAdmin);

  return sendSuccess(
    res,
    {
      message: "Setup endpoint is ready",
      supabaseConfigured: isSupabaseConfigured,
      timestamp: new Date().toISOString(),
    }
  );
});

// Route handlers
router.post("/create-admin", createAdminUser);
router.get("/health", setupHealth);

export default router;
