import { Request, Response } from "express";
import { staffService } from "../services/staffService";
import {
  asyncHandler,
  sendSuccess,
  ApiError,
  ErrorCode
} from "../middleware/errorHandler";
import {
  staffCreateSchema,
  staffUpdateSchema,
  validateRequest,
  StaffCreateData,
  StaffUpdateData
} from "../utils/validation";

// Get all staff for a clinic
export const getClinicStaff = asyncHandler(async (req: Request, res: Response) => {
  const { clinicId } = req.params;

  const clinicIdNum = Number(clinicId);
  if (isNaN(clinicIdNum)) {
    throw new ApiError(400, ErrorCode.BAD_REQUEST, "Invalid clinic ID");
  }

  const staff = await staffService.getClinicStaff(clinicIdNum);
  return sendSuccess(res, staff);
});

// Get staff member by ID
export const getStaffById = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;

  const staffId = Number(id);
  if (isNaN(staffId)) {
    throw new ApiError(400, ErrorCode.BAD_REQUEST, "Invalid staff ID");
  }

  const staff = await staffService.getStaffById(staffId);

  if (!staff) {
    throw new ApiError(404, ErrorCode.NOT_FOUND, "Staff member not found");
  }

  return sendSuccess(res, staff);
});

// Create new staff member
export const createStaff = asyncHandler(async (req: Request, res: Response) => {
  const input = validateRequest<StaffCreateData>(req.body, staffCreateSchema);

  const staff = await staffService.createStaff(input);
  return sendSuccess(res, staff, 201);
});

// Update staff member
export const updateStaff = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  const staffId = Number(id);
  if (isNaN(staffId)) {
    throw new ApiError(400, ErrorCode.BAD_REQUEST, "Invalid staff ID");
  }

  const input = validateRequest<StaffUpdateData>(req.body, staffUpdateSchema);

  const staff = await staffService.updateStaff(staffId, input);

  if (!staff) {
    throw new ApiError(404, ErrorCode.NOT_FOUND, "Staff member not found");
  }

  return sendSuccess(res, staff);
});

// Delete staff member
export const deleteStaff = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;

  const staffId = Number(id);
  if (isNaN(staffId)) {
    throw new ApiError(400, ErrorCode.BAD_REQUEST, "Invalid staff ID");
  }

  const success = await staffService.deleteStaff(staffId);

  if (!success) {
    throw new ApiError(404, ErrorCode.NOT_FOUND, "Staff member not found");
  }

  return sendSuccess(res, { message: "Staff member deleted successfully" });
})

// Staff login
export async function staffLogin(req: Request, res: Response) {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({ 
        error: "اسم المستخدم وكلمة المرور مطلوبان" 
      });
    }

    const result = await staffService.authenticateStaff(username, password);

    if (!result.success || !result.staff) {
      return res.status(401).json({ 
        error: "اسم المستخدم أو كلمة المرور غير صحيحة" 
      });
    }

    res.json({ staff: result.staff });
  } catch (error) {
    console.error("Error during staff login:", error);
    res.status(500).json({ error: "حدث خطأ أثناء تسجيل الدخول" });
  }
}

// Check if user has permission
export async function checkPermission(req: Request, res: Response) {
  try {
    const { userId, resource, action, clinicId } = req.query;

    if (!userId || !resource || !action) {
      return res.status(400).json({ 
        error: "User ID, resource, and action are required" 
      });
    }

    const hasPermission = await staffService.hasPermission(
      parseInt(userId as string),
      resource as string,
      action as string,
      clinicId ? parseInt(clinicId as string) : undefined
    );

    res.json({ hasPermission });
  } catch (error) {
    console.error("Error checking permission:", error);
    res.status(500).json({ error: "Failed to check permission" });
  }
}
