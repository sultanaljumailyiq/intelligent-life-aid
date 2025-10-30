/**
 * useSubscriptionApprovalNotification
 * Hook to manage subscription approval/rejection notifications
 * Polls the server for subscription status changes
 */

import { useState, useEffect, useCallback } from "react";
import { SubscriptionApprovalNotificationData } from "@/components/SubscriptionApprovalNotification";

interface UseSubscriptionApprovalNotificationOptions {
  pollInterval?: number; // milliseconds, default 30000 (30 seconds)
  enabled?: boolean;
}

export function useSubscriptionApprovalNotification(
  options: UseSubscriptionApprovalNotificationOptions = {},
) {
  const {
    pollInterval = 30000,
    enabled = true,
  } = options;

  const [notification, setNotification] = useState<SubscriptionApprovalNotificationData | null>(
    null,
  );
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [lastCheckedAt, setLastCheckedAt] = useState<number>(Date.now());
  const [hasError, setHasError] = useState(false);

  const checkForApprovals = useCallback(async () => {
    if (!enabled || isLoading || hasError) {
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      // Check for subscription requests with updated status
      const response = await fetch("/api/subscription-requests?includeUpdated=true", {
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        // If endpoint fails, disable polling to prevent cascading errors
        if (response.status === 500 || response.status === 429) {
          console.warn("Subscription polling disabled due to endpoint error:", response.status);
          setHasError(true);
          return;
        }
        throw new Error("Failed to fetch subscription status");
      }

      const requests = await response.json();

      // Find any that have been approved or rejected since last check
      const updatedRequest = requests.find(
        (req: any) =>
          (req.status === "approved" || req.status === "rejected") &&
          new Date(req.updatedAt || req.createdAt).getTime() > lastCheckedAt,
      );

      if (updatedRequest) {
        setNotification({
          id: updatedRequest.id,
          clinicName: updatedRequest.clinicName,
          clinicOwnerName: updatedRequest.ownerName,
          subscriptionType: updatedRequest.subscriptionType,
          subscriptionTier: updatedRequest.subscriptionTier,
          amount: updatedRequest.amount,
          duration: updatedRequest.duration,
          startDate: updatedRequest.startDate || new Date().toISOString(),
          endDate:
            updatedRequest.endDate ||
            new Date(Date.now() + updatedRequest.duration * 30 * 24 * 60 * 60 * 1000).toISOString(),
          status: updatedRequest.status === "approved" ? "approved" : "rejected",
          rejectionReason: updatedRequest.rejectionReason,
          message: updatedRequest.message,
        });

        // Update last checked time
        setLastCheckedAt(Date.now());

        // Mark as notified in the backend if approved
        if (updatedRequest.status === "approved") {
          try {
            await fetch(`/api/subscription-requests/${updatedRequest.id}/mark-notified`, {
              method: "POST",
            });
          } catch (err) {
            console.warn("Failed to mark subscription as notified:", err);
          }
        }
      }
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to check subscription status";
      setError(errorMessage);
      // Disable polling on repeated errors to prevent cascading failures
      console.warn("Error checking subscription approvals, disabling polling:", err);
      setHasError(true);
    } finally {
      setIsLoading(false);
    }
  }, [enabled, isLoading, lastCheckedAt, hasError]);

  // Poll for approvals/rejections
  useEffect(() => {
    if (!enabled) {
      return;
    }

    // Check immediately on mount
    checkForApprovals();

    // Set up polling interval
    const interval = setInterval(checkForApprovals, pollInterval);

    return () => {
      clearInterval(interval);
    };
  }, [enabled, pollInterval, checkForApprovals]);

  const dismissNotification = useCallback(() => {
    setNotification(null);
  }, []);

  const handleNotificationAction = useCallback(
    (action: "view" | "upgrade" | "contact") => {
      switch (action) {
        case "view":
          window.location.href = "/settings/subscription-requests";
          break;
        case "upgrade":
          window.location.href = "/settings/subscriptions";
          break;
        case "contact":
          window.location.href = "https://smartclinic.app/support";
          break;
        default:
          break;
      }
    },
    [],
  );

  return {
    notification,
    isLoading,
    error,
    dismissNotification,
    handleNotificationAction,
    checkNow: checkForApprovals,
  };
}
