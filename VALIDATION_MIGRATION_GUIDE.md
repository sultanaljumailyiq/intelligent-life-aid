# Server-Side Validation Migration Guide

## Overview
This guide explains how to apply the new validation system to remaining API routes. The validation system provides:
- ✅ Centralized Zod schemas (server/utils/validation.ts)
- ✅ Standardized error handling (server/middleware/errorHandler.ts)
- ✅ Automatic async error catching (asyncHandler wrapper)
- ✅ Consistent API response format

## Pattern Example (Products Route)

### Before (No Validation)
```typescript
export async function createProduct(req: Request, res: Response) {
  try {
    const productData = req.body; // ❌ No validation!
    // ... business logic
    res.status(201).json(newProduct);
  } catch (error) {
    res.status(500).json({ error: "Failed to create product" });
  }
}
```

### After (With Validation)
```typescript
import { asyncHandler, sendSuccess, ApiError, ErrorCode } from "../middleware/errorHandler";
import { productCreateSchema, validateRequest, ProductCreateData } from "../utils/validation";

export const createProduct = asyncHandler(async (req: Request, res: Response) => {
  const productData = validateRequest<ProductCreateData>(req.body, productCreateSchema);
  
  // ... business logic - errors are automatically caught
  
  return sendSuccess(res, newProduct, 201);
});
```

## Implementation Steps

### Step 1: Add Imports
For each route file, add:
```typescript
import { asyncHandler, sendSuccess, sendError, ApiError, ErrorCode } from "../middleware/errorHandler";
import { 
  [relevant schemas and types from validation],
  validateRequest,
  [DataTypes]
} from "../utils/validation";
```

### Step 2: Update Function Signatures
```typescript
// Before
export async function createOrder(req: Request, res: Response) {

// After
export const createOrder = asyncHandler(async (req: Request, res: Response) => {
```

### Step 3: Add Validation
```typescript
// At the start of the function, validate incoming data
const validatedData = validateRequest<OrderCreateData>(req.body, orderCreateSchema);
```

### Step 4: Replace Response Calls
```typescript
// Before
res.status(201).json(newOrder);
res.status(404).json({ error: "Order not found" });
res.status(500).json({ error: "Failed to create order" });

// After
return sendSuccess(res, newOrder, 201);
throw new ApiError(404, ErrorCode.NOT_FOUND, "Order not found");
// (errors are caught automatically, no need for try-catch)
```

## Routes to Update (Priority Order)

### High Priority (Frequently Used)
1. **server/routes/orders.ts** - createOrder, updateOrderStatus
2. **server/routes/staff.ts** - staffLogin, createStaff, updateStaff
3. **server/routes/cart.ts** - addToCart, updateCartItem
4. **server/routes/subscriptions.ts** - createSubscription, renewSubscription
5. **server/routes/userProfile.ts** - updateProfile

### Medium Priority (Content Management)
6. **server/routes/communityPosts.ts** - createPost, updatePost
7. **server/routes/communityComments.ts** - createComment, updateComment
8. **server/routes/paymentMethods.ts** - createPaymentMethod, updatePaymentMethod
9. **server/routes/clinics.ts** - createClinic, updateClinic
10. **server/routes/suppliers.ts** - createSupplier, updateSupplier

### Lower Priority (Admin/Analytics)
11. **server/routes/adminDashboard.ts**
12. **server/routes/platformSettings.ts**
13. **server/routes/paymentVerification.ts**
14. And remaining routes...

## Validation Schema Mapping

| Route | Create Schema | Update Schema | Notes |
|-------|---------------|---------------|-------|
| products.ts | productCreateSchema | productUpdateSchema | ✅ Done |
| orders.ts | orderCreateSchema | orderStatusUpdateSchema | Also validate cart items |
| staff.ts | staffCreateSchema | staffUpdateSchema | Include password hashing |
| subscriptions.ts | subscriptionCreateSchema | subscriptionUpdateSchema | Validate plan exists |
| clinics.ts | clinicCreateSchema | clinicUpdateSchema | Validate coordinates |
| suppliers.ts | Need schema | Need schema | Add to validation.ts |
| cart.ts | Need schema | Need schema | Add to validation.ts |

## Adding Missing Schemas

Some routes don't have schemas yet. Add them to server/utils/validation.ts:

```typescript
// Example: Cart schema
export const cartAddSchema = z.object({
  userId: idSchema,
  productId: idSchema,
  quantity: z.number().int().positive(),
  notes: z.string().optional(),
});

export const cartUpdateSchema = z.object({
  quantity: z.number().int().positive(),
  notes: z.string().optional(),
});

export type CartAddData = z.infer<typeof cartAddSchema>;
export type CartUpdateData = z.infer<typeof cartUpdateSchema>;
```

## Handling Mock Data Removal

Current mock data locations found:
- **server/routes/suppliers.ts** - mockSupplierData, mockProducts
- **server/routes/products.ts** - mockProducts (removed via validation)
- **server/routes/badges.ts** - FALLBACK_BADGES
- **server/routes/rewards.ts** - FALLBACK_REWARDS
- **shared/fallbackData.ts** - FALLBACK_SUBSCRIPTION_PLANS, FALLBACK_PAYMENT_METHODS

### Strategy:
1. **Remove mock data** from routes (now that error handling is in place)
2. **Use error responses** instead of fallback data for DB failures
3. **Only keep fallback data** for truly optional features
4. **Example**: Instead of returning mockProducts, throw an error that gets caught properly

```typescript
// Before (with mock data)
if (dbError) {
  return res.json({ products: mockProducts }); // ❌ Misleading!
}

// After (with error handling)
// Let error propagate to error handler
// Client receives: { success: false, error: { message, code } }
```

## Database Transaction Pattern

For operations involving multiple inserts/updates, use transactions:

```typescript
export const createOrderWithItems = asyncHandler(async (req: Request, res: Response) => {
  const validatedData = validateRequest<OrderCreateData>(req.body, orderCreateSchema);
  
  // Use transaction to ensure all-or-nothing
  const [newOrder, items] = await db.transaction(async (tx) => {
    const [order] = await tx.insert(orders).values({...}).returning();
    const insertedItems = await tx.insert(orderItems).values([...]).returning();
    return [order, insertedItems];
  });
  
  return sendSuccess(res, { order: newOrder, items }, 201);
});
```

## Testing the Implementation

### Before making changes to production routes:
1. Test the products route validation works: `POST /api/products` with invalid data should return 400
2. Test error handling: `GET /api/products/invalid-id` should return standardized error
3. Test success response: Successful request should have { success: true, data: ... }

### Commands to verify:
```bash
# Test validation error
curl -X POST http://localhost:3000/api/products \
  -H "Content-Type: application/json" \
  -d '{"name":""}' # Missing required fields

# Test 404 error
curl http://localhost:3000/api/products/999999

# Test success
curl http://localhost:3000/api/products
```

## Error Response Format

All errors now follow this format:
```json
{
  "success": false,
  "error": {
    "message": "Product not found",
    "code": "NOT_FOUND",
    "details": {
      "productId": 999
    }
  },
  "timestamp": "2024-01-15T10:30:00.000Z"
}
```

Success responses:
```json
{
  "success": true,
  "data": { /* ... response data ... */ },
  "timestamp": "2024-01-15T10:30:00.000Z"
}
```

## Cookie Authentication (Client-Side)

The server now supports both:
1. **Authorization Header**: `Authorization: Bearer <token>`
2. **httpOnly Cookie**: `auth_token` (set by server)

### Server sets cookies after login:
```typescript
import { setAuthResponse } from "../utils/cookies";

export const login = asyncHandler(async (req: Request, res: Response) => {
  // ... validate credentials
  setAuthResponse(res, token, JSON.stringify(userData));
  return sendSuccess(res, { user: userData, token });
});
```

### Client (React) automatically sends cookies:
```typescript
// Axios or fetch with credentials: 'include'
const response = await fetch('/api/protected-endpoint', {
  credentials: 'include' // Automatically sends cookies
});
```

## Checklist for Route Migration

For each route file that needs updating:
- [ ] Add imports (asyncHandler, sendSuccess, ApiError, validation schemas)
- [ ] Convert function signatures to const + asyncHandler
- [ ] Add validateRequest() call at start of create/update endpoints
- [ ] Replace res.json() with return sendSuccess(res, data)
- [ ] Replace res.status(404).json with throw new ApiError(404, ...)
- [ ] Remove try-catch blocks (handled by asyncHandler)
- [ ] Remove manual error logging (still logged automatically)
- [ ] Test endpoint with invalid input
- [ ] Test endpoint with valid input
- [ ] Remove mock/fallback data (unless necessary)
- [ ] Update any TypeScript types to match validated data

## Questions & Support

If you encounter issues:
1. Check if schema exists in server/utils/validation.ts
2. Ensure all required fields are in the schema
3. Check if the error handler is properly catching the error
4. Look at products.ts or server/routes/communityAdmin.ts for examples
5. See server/middleware/errorHandler.ts for available error codes

## Timeline Estimate

- **Phase 1** (Completed): Validation utility + error handler + products example
- **Phase 2** (Current): Update high-priority routes (5-10 routes)
- **Phase 3**: Update medium-priority routes (10-15 routes)
- **Phase 4**: Remove mock data and finalize
- **Phase 5**: Client-side updates for cookie support

Each route typically takes 5-10 minutes to update once the pattern is understood.
