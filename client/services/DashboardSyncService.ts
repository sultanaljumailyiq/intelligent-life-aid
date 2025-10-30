/**
 * DashboardSyncService
 * Syncs lab order data to clinic dashboard, dental hub, and notifies relevant staff
 */

interface LabOrder {
  id: string;
  patientId: string;
  patientName: string;
  labId: string;
  treatment: string;
  tooth: string;
  expectedDate: string;
  priority: "low" | "medium" | "high" | "urgent";
  cost: number;
  notes: string;
  createdAt?: string;
}

interface DashboardNotification {
  id?: string;
  type: string;
  title: string;
  message: string;
  labOrderId: string;
  severity: "info" | "warning" | "success" | "error";
  actionUrl: string;
  createdAt?: string;
}

interface StaffNotification {
  id?: string;
  recipientId: string;
  recipientRole: "dentist" | "clinic_staff" | "lab_technician" | "admin";
  type: string;
  title: string;
  message: string;
  labOrderId: string;
  isRead: boolean;
  createdAt?: string;
}

/**
 * Sync lab order to clinic dashboard
 * Updates clinic management dashboard with new lab order information
 */
export async function syncLabOrderToClinicDashboard(
  labOrder: LabOrder,
): Promise<void> {
  try {
    const notification: DashboardNotification = {
      type: "lab_order_created",
      title: `طلب مختبر جديد - ${labOrder.treatment}`,
      message: `تم إنشاء طلب مختبر جديد للمريض ${labOrder.patientName} - السن ${labOrder.tooth}. التاريخ المتوقع: ${new Date(labOrder.expectedDate).toLocaleDateString("ar-EG")}`,
      labOrderId: labOrder.id,
      severity: labOrder.priority === "urgent" ? "error" : "info",
      actionUrl: `/clinic_old/patients/${labOrder.patientId}`,
    };

    const response = await fetch("/api/dashboard/clinic/notifications", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(notification),
    });

    if (!response.ok) {
      console.error("Failed to sync lab order to clinic dashboard");
      return;
    }

    // Update clinic lab orders list
    await fetch("/api/clinic/lab-orders", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        ...labOrder,
        status: "pending",
        syncedAt: new Date().toISOString(),
      }),
    });
  } catch (error) {
    console.error("Error syncing lab order to clinic dashboard:", error);
    throw error;
  }
}

/**
 * Sync lab order to dental hub
 * Makes lab order visible in the dental hub portal for technicians
 */
export async function syncLabOrderToDentalHub(
  labOrder: LabOrder,
): Promise<void> {
  try {
    const response = await fetch("/api/dental-hub/lab-orders", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        ...labOrder,
        status: "received",
        receivedAt: new Date().toISOString(),
      }),
    });

    if (!response.ok) {
      console.error("Failed to sync lab order to dental hub");
      return;
    }

    // Create notification in dental hub
    const notification: DashboardNotification = {
      type: "lab_order_received",
      title: `طلب مختبر جديد - ${labOrder.treatment}`,
      message: `تم استقبال طلب مختبر جديد: ${labOrder.treatment} للسن ${labOrder.tooth}. الأولوية: ${getPriorityLabel(labOrder.priority)}`,
      labOrderId: labOrder.id,
      severity: labOrder.priority === "urgent" ? "error" : "info",
      actionUrl: `/dental-hub/lab-orders/${labOrder.id}`,
    };

    await fetch("/api/dental-hub/notifications", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(notification),
    });
  } catch (error) {
    console.error("Error syncing lab order to dental hub:", error);
    throw error;
  }
}

/**
 * Notify relevant staff members about the new lab order
 */
export async function notifyStaff(
  labOrder: LabOrder,
  userRole: string,
): Promise<void> {
  try {
    // Determine which roles should be notified based on priority
    const rolesNotified: (
      | "dentist"
      | "clinic_staff"
      | "lab_technician"
      | "admin"
    )[] = ["clinic_staff"];

    if (labOrder.priority === "urgent") {
      rolesNotified.push("dentist", "admin");
    }

    if (labOrder.priority === "high") {
      rolesNotified.push("dentist");
    }

    // Get staff members for notification
    const staffResponse = await fetch("/api/clinic/staff", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!staffResponse.ok) {
      console.error("Failed to fetch clinic staff");
      return;
    }

    const staff = await staffResponse.json();

    // Create notifications for each staff member
    const notificationPromises = staff
      .filter((member: any) => rolesNotified.includes(member.role))
      .map((member: any) => {
        const notification: StaffNotification = {
          recipientId: member.id,
          recipientRole: member.role,
          type: "lab_order_created",
          title: `طلب مختبر جديد - ${labOrder.treatment}`,
          message: `${labOrder.patientName}: ${labOrder.treatment} للسن ${labOrder.tooth} - التاريخ المتوقع: ${new Date(labOrder.expectedDate).toLocaleDateString("ar-EG")}`,
          labOrderId: labOrder.id,
          isRead: false,
        };

        return fetch("/api/notifications", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(notification),
        });
      });

    await Promise.all(notificationPromises);
  } catch (error) {
    console.error("Error notifying staff about lab order:", error);
    throw error;
  }
}

/**
 * Update lab order status across dashboards
 * Called when lab order status changes (e.g., delivered, delayed)
 */
export async function updateLabOrderStatusAcrossDashboards(
  labOrderId: string,
  status: "pending" | "in_progress" | "delivered" | "delayed" | "cancelled",
  message?: string,
): Promise<void> {
  try {
    // Update clinic dashboard
    await fetch(`/api/clinic/lab-orders/${labOrderId}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        status,
        updatedAt: new Date().toISOString(),
      }),
    });

    // Update dental hub
    await fetch(`/api/dental-hub/lab-orders/${labOrderId}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        status,
        updatedAt: new Date().toISOString(),
      }),
    });

    // Send status change notification
    const notificationMessage =
      message || `حالة الطلب تم تحديثها إلى: ${getStatusLabel(status)}`;

    await fetch("/api/notifications", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        type: "lab_order_status_changed",
        title: `تحديث حالة طلب المختبر`,
        message: notificationMessage,
        labOrderId,
        severity:
          status === "delayed" || status === "cancelled" ? "warning" : "info",
      }),
    });
  } catch (error) {
    console.error("Error updating lab order status across dashboards:", error);
    throw error;
  }
}

/**
 * Helper function to get priority label in Arabic
 */
function getPriorityLabel(
  priority: "low" | "medium" | "high" | "urgent",
): string {
  const labels: Record<string, string> = {
    low: "منخفضة",
    medium: "متوسطة",
    high: "عالية",
    urgent: "عاجلة",
  };
  return labels[priority] || priority;
}

/**
 * Helper function to get status label in Arabic
 */
function getStatusLabel(
  status: "pending" | "in_progress" | "delivered" | "delayed" | "cancelled",
): string {
  const labels: Record<string, string> = {
    pending: "قيد الانتظار",
    in_progress: "قيد الإنجاز",
    delivered: "تم التسليم",
    delayed: "متأخر",
    cancelled: "ملغي",
  };
  return labels[status] || status;
}

/**
 * Get all pending lab orders for dashboard display
 */
export async function getPendingLabOrders(): Promise<LabOrder[]> {
  try {
    const response = await fetch("/api/clinic/lab-orders?status=pending");

    if (!response.ok) {
      throw new Error("Failed to fetch pending lab orders");
    }

    return response.json();
  } catch (error) {
    console.error("Error fetching pending lab orders:", error);
    throw error;
  }
}

/**
 * Get lab order statistics for dashboard analytics
 */
export async function getLabOrderStats(): Promise<{
  total: number;
  pending: number;
  delivered: number;
  delayed: number;
  cancelled: number;
  averageTurnaroundDays: number;
}> {
  try {
    const response = await fetch("/api/clinic/lab-orders/stats");

    if (!response.ok) {
      throw new Error("Failed to fetch lab order statistics");
    }

    return response.json();
  } catch (error) {
    console.error("Error fetching lab order statistics:", error);
    throw error;
  }
}
