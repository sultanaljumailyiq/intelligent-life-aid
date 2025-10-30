import { drizzle } from "drizzle-orm/neon-http";
import { neon } from "@neondatabase/serverless";
import * as schema from "../shared/schema";

// In development, DATABASE_URL may be absent. Provide a graceful fallback so the app can boot
// and individual routes can catch DB calls and use mock data when available.

function createFallbackDb() {
  const error = new Error(
    "Database unavailable: DATABASE_URL is not set. Running in fallback mode."
  );
  const thrower = () => {
    throw error;
  };
  // Minimal surface used across routes
  return {
    select: thrower,
    insert: thrower,
    update: thrower,
    delete: thrower,
    transaction: thrower,
    execute: thrower,
  } as any;
}

const hasUrl = !!process.env.DATABASE_URL;

const db = hasUrl
  ? drizzle({ client: neon(process.env.DATABASE_URL!), schema })
  : createFallbackDb();

export { db };

// Export tables for easy access
export {
  users,
  suppliers,
  categories,
  brands,
  products,
  orders,
  orderItems,
  commissionSettings,
  platformCommissions,
  cart,
  favorites,
  reviews,
  clinics,
  subscriptionPlans,
  clinicPayments,
  mapSettings,
  paymentMethods,
  coupons,
  paymentSettings,
  cashPaymentCenters,
  supplierApprovals,
  supplierNotifications,
  supplierAnalytics,
  // New payment and commission tables
  paymentMethodsConfig,
  commissionInvoices,
  subscriptionPayments,
  manualPaymentReviews,
  supplierSalesReports,
  // Usage tracking and rewards
  usageTracking,
  userRewards,
  subscriptionBadges,
  userBadges,
} from "../shared/schema";
