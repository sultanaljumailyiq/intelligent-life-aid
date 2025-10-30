/**
 * GlobalNotificationContainer
 * Displays global notifications including subscription approvals/rejections
 * Should be added near the root of the app layout
 */

import React from "react";
import SubscriptionApprovalNotification from "@/components/SubscriptionApprovalNotification";
import { useSubscriptionApprovalNotification } from "@/hooks/useSubscriptionApprovalNotification";

interface GlobalNotificationContainerProps {
  enabled?: boolean;
}

export function GlobalNotificationContainer({
  enabled = true,
}: GlobalNotificationContainerProps) {
  const {
    notification,
    dismissNotification,
    handleNotificationAction,
  } = useSubscriptionApprovalNotification({
    pollInterval: 30000, // Poll every 30 seconds
    enabled,
  });

  if (!notification) {
    return null;
  }

  return (
    <SubscriptionApprovalNotification
      notification={notification}
      onClose={dismissNotification}
      onAction={handleNotificationAction}
    />
  );
}

export default GlobalNotificationContainer;
