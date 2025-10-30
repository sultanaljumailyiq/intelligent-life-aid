/**
 * SubscriptionApprovalNotification
 * Displays a notification popup when subscription request is approved or rejected by admin
 */

import React, { useState, useEffect } from "react";
import {
  CheckCircle,
  XCircle,
  AlertCircle,
  X,
  Clock,
  DollarSign,
  Building2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export interface SubscriptionApprovalNotificationData {
  id: number;
  clinicName: string;
  clinicOwnerName: string;
  subscriptionType: string;
  subscriptionTier: string;
  amount: number;
  duration: number;
  startDate: string;
  endDate: string;
  status: "approved" | "rejected";
  rejectionReason?: string;
  message?: string;
}

interface SubscriptionApprovalNotificationProps {
  notification: SubscriptionApprovalNotificationData;
  onClose: () => void;
  onAction?: (action: "view" | "upgrade" | "contact") => void;
}

export function SubscriptionApprovalNotification({
  notification,
  onClose,
  onAction,
}: SubscriptionApprovalNotificationProps) {
  const [isVisible, setIsVisible] = useState(true);
  const [autoHideTimer, setAutoHideTimer] = useState<NodeJS.Timeout | null>(
    null,
  );

  useEffect(() => {
    // Auto-hide after 8 seconds, but longer for rejections
    const delay = notification.status === "approved" ? 8000 : 12000;
    const timer = setTimeout(() => {
      setIsVisible(false);
      onClose();
    }, delay);

    setAutoHideTimer(timer);

    return () => {
      if (timer) {
        clearTimeout(timer);
      }
    };
  }, [onClose, notification.status]);

  const handleClose = () => {
    setIsVisible(false);
    if (autoHideTimer) {
      clearTimeout(autoHideTimer);
    }
    onClose();
  };

  const handleAction = (action: "view" | "upgrade" | "contact") => {
    if (onAction) {
      onAction(action);
    }
    handleClose();
  };

  if (!isVisible) {
    return null;
  }

  const isApproved = notification.status === "approved";
  const bgColor = isApproved
    ? "bg-gradient-to-r from-green-50 to-emerald-50"
    : "bg-gradient-to-r from-red-50 to-orange-50";
  const borderColor = isApproved ? "border-green-300" : "border-red-300";
  const iconColor = isApproved ? "text-green-600" : "text-red-600";

  return (
    <div
      className={cn(
        "fixed top-4 right-4 w-96 max-w-[calc(100vw-32px)] rounded-2xl shadow-2xl border-l-4 overflow-hidden z-50 animate-in slide-in-from-top-2 duration-300",
        bgColor,
        borderColor,
        isApproved ? "border-l-green-600" : "border-l-red-600",
      )}
    >
      {/* Header */}
      <div className="flex items-start justify-between p-4 pb-3">
        <div className="flex items-center gap-3 flex-1">
          {isApproved ? (
            <CheckCircle className={cn("w-6 h-6 flex-shrink-0", iconColor)} />
          ) : (
            <XCircle className={cn("w-6 h-6 flex-shrink-0", iconColor)} />
          )}
          <div className="flex-1">
            <h3 className="font-bold text-gray-900">
              {isApproved
                ? "تمت الموافقة على الاشتراك! ✨"
                : "تم رفض طلب الاشتراك"}
            </h3>
            <p className="text-xs text-gray-600 mt-0.5">
              {notification.clinicOwnerName}
            </p>
          </div>
        </div>
        <button
          onClick={handleClose}
          className="text-gray-400 hover:text-gray-600 flex-shrink-0 mt-0.5"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Clinic Info */}
      <div className="px-4 py-3 border-t border-opacity-20 border-gray-300">
        <div className="flex items-center gap-2 mb-2">
          <Building2 className="w-4 h-4 text-gray-600" />
          <span className="text-sm font-medium text-gray-900">
            {notification.clinicName}
          </span>
        </div>

        {isApproved && (
          <div className="space-y-2">
            {/* Subscription Details */}
            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="bg-white/60 rounded-lg p-2">
                <p className="text-gray-600 mb-0.5">نوع الاشتراك</p>
                <p className="font-semibold text-gray-900">
                  {notification.subscriptionType}
                </p>
              </div>
              <div className="bg-white/60 rounded-lg p-2 flex items-center gap-2">
                <DollarSign className="w-3 h-3 text-gray-600" />
                <div>
                  <p className="text-gray-600 mb-0.5">المبلغ</p>
                  <p className="font-semibold text-gray-900">
                    {(notification.amount / 1000).toLocaleString("ar-EG")} ألف د.ع
                  </p>
                </div>
              </div>
            </div>

            {/* Date Range */}
            <div className="bg-white/60 rounded-lg p-2 text-xs">
              <div className="flex items-center gap-2 text-gray-600 mb-1">
                <Clock className="w-3 h-3" />
                <span>��ترة الاشتراك</span>
              </div>
              <p className="text-gray-900 font-medium">
                من {new Date(notification.startDate).toLocaleDateString("ar-EG")}{" "}
                إلى {new Date(notification.endDate).toLocaleDateString("ar-EG")}
              </p>
            </div>

            {/* Success Message */}
            <div className="bg-green-100 border border-green-300 rounded-lg p-2">
              <p className="text-xs text-green-800">
                <span className="font-semibold">✓ تم التفعيل:</span> يمكنك البدء في
                استخدام جميع مميزات الاشتراك الآن
              </p>
            </div>
          </div>
        )}

        {!isApproved && (
          <div className="space-y-2">
            {/* Rejection Reason */}
            {notification.rejectionReason && (
              <div className="bg-red-100 border border-red-300 rounded-lg p-2">
                <p className="text-xs text-red-800 mb-1">
                  <span className="font-semibold">سبب الرفض:</span>
                </p>
                <p className="text-xs text-red-700">
                  {notification.rejectionReason}
                </p>
              </div>
            )}

            {/* Alternative Message */}
            {notification.message && (
              <div className="bg-orange-100 border border-orange-300 rounded-lg p-2">
                <p className="text-xs text-orange-800">
                  {notification.message}
                </p>
              </div>
            )}

            {/* Contact Support */}
            <div className="bg-white/60 rounded-lg p-2">
              <p className="text-xs text-gray-600 mb-2">
                للمزيد من المعلومات أو للاستفسار عن الرفض:
              </p>
              <a
                href="mailto:support@smartclinic.app"
                className="text-xs font-semibold text-red-600 hover:text-red-700 inline-flex items-center gap-1"
              >
                تواصل مع الدعم
                <span>→</span>
              </a>
            </div>
          </div>
        )}
      </div>

      {/* Actions */}
      <div className="px-4 py-3 border-t border-opacity-20 border-gray-300 flex gap-2 bg-white/40">
        <Button
          onClick={() => handleAction("view")}
          variant="outline"
          size="sm"
          className="flex-1"
        >
          عرض التفاصيل
        </Button>
        {isApproved ? (
          <Button
            onClick={() => handleAction("upgrade")}
            size="sm"
            className="flex-1 bg-green-600 hover:bg-green-700"
          >
            البدء الآن
          </Button>
        ) : (
          <Button
            onClick={() => handleAction("contact")}
            size="sm"
            variant="destructive"
            className="flex-1"
          >
            الاتصال بالدعم
          </Button>
        )}
      </div>
    </div>
  );
}

export default SubscriptionApprovalNotification;
