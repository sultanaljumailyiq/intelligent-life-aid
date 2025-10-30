import { Request, Response } from "express";
import { db, products, suppliers, categories, brands } from "../storage";
import { supplierApprovals } from "../../shared/schema";
import { eq, desc, like, and, gte, lte, sql, or } from "drizzle-orm";
import {
  productCreateSchema,
  productUpdateSchema,
  validateRequest,
  ProductCreateData,
  ProductUpdateData
} from "../utils/validation";
import { asyncHandler, sendSuccess, sendError, ErrorCode, ApiError } from "../middleware/errorHandler";

// Get all products with filters
export const getProducts = asyncHandler(async (req: Request, res: Response) => {
  const {
    category,
    supplier,
    brand,
    search,
    minPrice,
    maxPrice,
    featured,
    new: isNew,
    limit = 20,
    offset = 0,
  } = req.query;

  let query = db.select().from(products).$dynamic();

  // Apply filters
  const conditions = [];

  if (category) {
    conditions.push(eq(products.categoryId, Number(category)));
  }

  if (supplier) {
    conditions.push(eq(products.supplierId, Number(supplier)));
  }

  if (brand) {
    conditions.push(eq(products.brandId, Number(brand)));
  }

  if (search) {
    conditions.push(
      or(
        like(products.name, `%${search}%`),
        like(products.arabicName, `%${search}%`)
      )
    );
  }

  if (minPrice) {
    conditions.push(gte(products.price, minPrice.toString()));
  }

  if (maxPrice) {
    conditions.push(lte(products.price, maxPrice.toString()));
  }

  if (featured === 'true') {
    conditions.push(eq(products.isFeatured, true));
  }

  if (isNew === 'true') {
    conditions.push(eq(products.isNew, true));
  }

  if (conditions.length > 0) {
    query = query.where(and(...conditions));
  }

  const result = await query
    .orderBy(desc(products.createdAt))
    .limit(Number(limit))
    .offset(Number(offset));

  return sendSuccess(res, { products: result, count: result.length });
})

// Get product by ID
export const getProductById = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;

  const productId = Number(id);
  if (isNaN(productId)) {
    throw new ApiError(400, ErrorCode.BAD_REQUEST, "Invalid product ID");
  }

  const product = await db.query.products.findFirst({
    where: eq(products.id, productId),
    with: {
      supplier: true,
      category: true,
      brand: true,
    },
  });

  if (!product) {
    throw new ApiError(404, ErrorCode.NOT_FOUND, "Product not found");
  }

  // Increment view count
  await db.update(products)
    .set({ viewCount: sql`${products.viewCount} + 1` })
    .where(eq(products.id, productId));

  return sendSuccess(res, product);
})

// Create product (Supplier only)
export const createProduct = asyncHandler(async (req: Request, res: Response) => {
  const productData = validateRequest<ProductCreateData>(req.body, productCreateSchema);
  const { supplierId } = productData;

  if (!supplierId) {
    throw new ApiError(400, ErrorCode.BAD_REQUEST, "Supplier ID is required");
  }

  // Check if supplier is approved
  const [approval] = await db
    .select()
    .from(supplierApprovals)
    .where(eq(supplierApprovals.supplierId, supplierId as number))
    .limit(1);

  if (!approval) {
    throw new ApiError(
      403,
      ErrorCode.AUTHORIZATION_ERROR,
      "موافقة المورد غير موجودة - يجب الحصول على موافقة المنصة أولاً"
    );
  }

  if (approval.status !== "approved") {
    throw new ApiError(
      403,
      ErrorCode.AUTHORIZATION_ERROR,
      approval.status === "pending"
        ? "طلب الموافقة قيد المراجعة. سيتم إشعارك عند الموافقة."
        : "تم رفض طلب الموافقة. يرجى التواصل مع إدارة المنصة.",
      { status: approval.status }
    );
  }

  const [newProduct] = await db.insert(products)
    .values({
      ...productData,
      createdAt: new Date(),
      updatedAt: new Date(),
    })
    .returning();

  return sendSuccess(res, newProduct, 201);
})

// Update product (Supplier only)
export const updateProduct = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  const updates = validateRequest<ProductUpdateData>(req.body, productUpdateSchema);

  const productId = Number(id);
  if (isNaN(productId)) {
    throw new ApiError(400, ErrorCode.BAD_REQUEST, "Invalid product ID");
  }

  const [updatedProduct] = await db.update(products)
    .set({
      ...updates,
      updatedAt: new Date(),
    })
    .where(eq(products.id, productId))
    .returning();

  if (!updatedProduct) {
    throw new ApiError(404, ErrorCode.NOT_FOUND, "Product not found");
  }

  return sendSuccess(res, updatedProduct);
})

// Delete product (Supplier only)
export const deleteProduct = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;

  const productId = Number(id);
  if (isNaN(productId)) {
    throw new ApiError(400, ErrorCode.BAD_REQUEST, "Invalid product ID");
  }

  const result = await db.delete(products).where(eq(products.id, productId)).returning();

  if (!result || result.length === 0) {
    throw new ApiError(404, ErrorCode.NOT_FOUND, "Product not found");
  }

  return sendSuccess(res, { message: "Product deleted successfully" });
})

// Get products by supplier
export const getProductsBySupplier = asyncHandler(async (req: Request, res: Response) => {
  const { supplierId } = req.params;

  const supplierIdNum = Number(supplierId);
  if (isNaN(supplierIdNum)) {
    throw new ApiError(400, ErrorCode.BAD_REQUEST, "Invalid supplier ID");
  }

  const result = await db.select()
    .from(products)
    .where(eq(products.supplierId, supplierIdNum))
    .orderBy(desc(products.createdAt));

  return sendSuccess(res, { products: result, count: result.length });
})
