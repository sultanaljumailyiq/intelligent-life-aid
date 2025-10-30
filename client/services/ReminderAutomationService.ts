/**
 * ReminderAutomationService
 * Handles automatic creation of reminders for lab orders
 * Creates reminders at 50%, 75%, and 90% before expected delivery date
 */

interface LabOrder {
  id: string;
  patientId: string;
  labId: string;
  treatment: string;
  tooth: string;
  expectedDate: string;
  priority: "low" | "medium" | "high" | "urgent";
  cost: number;
  notes: string;
}

interface Reminder {
  id: string;
  labOrderId: string;
  reminderDate: string;
  reminderType: "50%" | "75%" | "90%";
  message: string;
  isActive: boolean;
  createdAt: string;
}

/**
 * Calculate reminder dates based on expected delivery date
 * Creates reminders at 50%, 75%, and 90% before the deadline
 */
function calculateReminderDates(expectedDate: string): Array<{
  date: string;
  type: "50%" | "75%" | "90%";
  message: string;
}> {
  const deliveryDate = new Date(expectedDate);
  const now = new Date();
  const daysUntilDelivery = Math.floor(
    (deliveryDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24),
  );

  const reminders: Array<{
    date: string;
    type: "50%" | "75%" | "90%";
    message: string;
  }> = [];

  if (daysUntilDelivery > 0) {
    const reminderDates = [
      { percentage: 0.5, type: "50%" as const },
      { percentage: 0.75, type: "75%" as const },
      { percentage: 0.9, type: "90%" as const },
    ];

    reminderDates.forEach(({ percentage, type }) => {
      const daysBeforeDelivery = Math.floor(daysUntilDelivery * percentage);
      const reminderDate = new Date(deliveryDate);
      reminderDate.setDate(
        reminderDate.getDate() - daysBeforeDelivery,
      );

      if (reminderDate > now) {
        reminders.push({
          date: reminderDate.toISOString(),
          type,
          message: `تذكير: ${type} من الوقت قبل التسليم المتوقع للعمل`,
        });
      }
    });
  }

  return reminders;
}

/**
 * Create automatic reminders for a lab order
 * Generates 3 reminders at 50%, 75%, and 90% before expected delivery date
 */
export async function createRemindersForLabOrder(
  labOrder: LabOrder,
): Promise<Reminder[]> {
  try {
    const reminderDates = calculateReminderDates(labOrder.expectedDate);
    const createdReminders: Reminder[] = [];

    for (const reminder of reminderDates) {
      const response = await fetch("/api/reminders", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          labOrderId: labOrder.id,
          reminderDate: reminder.date,
          reminderType: reminder.type,
          message: reminder.message,
          isActive: true,
        }),
      });

      if (!response.ok) {
        console.error(`Failed to create ${reminder.type} reminder`);
        continue;
      }

      const createdReminder = await response.json();
      createdReminders.push(createdReminder);
    }

    return createdReminders;
  } catch (error) {
    console.error("Error creating reminders for lab order:", error);
    throw error;
  }
}

/**
 * Update reminder status (mark as sent, completed, etc.)
 */
export async function updateReminderStatus(
  reminderId: string,
  status: "sent" | "pending" | "completed",
): Promise<Reminder> {
  try {
    const response = await fetch(`/api/reminders/${reminderId}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ status }),
    });

    if (!response.ok) {
      throw new Error("Failed to update reminder status");
    }

    return response.json();
  } catch (error) {
    console.error("Error updating reminder status:", error);
    throw error;
  }
}

/**
 * Get all reminders for a lab order
 */
export async function getRemindersForLabOrder(
  labOrderId: string,
): Promise<Reminder[]> {
  try {
    const response = await fetch(`/api/lab-orders/${labOrderId}/reminders`);

    if (!response.ok) {
      throw new Error("Failed to fetch reminders");
    }

    return response.json();
  } catch (error) {
    console.error("Error fetching reminders:", error);
    throw error;
  }
}

/**
 * Send notification for upcoming reminder
 * Called when reminder date is reached
 */
export async function sendReminderNotification(
  reminder: Reminder,
  labOrder: LabOrder,
): Promise<void> {
  try {
    await fetch("/api/notifications", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        type: "lab_order_reminder",
        title: `تذكير: طلب مختبر ${reminder.reminderType}`,
        message: reminder.message,
        labOrderId: labOrder.id,
        recipientRole: "clinic_staff",
        actionUrl: `/clinic_old/patients/${labOrder.patientId}`,
      }),
    });
  } catch (error) {
    console.error("Error sending reminder notification:", error);
    throw error;
  }
}
