import React, { useState, useEffect } from "react";
import { AlertCircle, Clock, DollarSign, CheckCircle, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface PendingSubscription {
  id: number;
  paymentNumber: string;
  clinicName: string;
  userName: string;
  subscriptionType: string;
  amount: number;
  duration: number;
  status: "pending_verification" | "verified" | "activated" | "rejected";
  createdAt: string;
  rejectionReason?: string;
}

interface PendingSubscriptionNotificationProps {
  className?: string;
  showDismiss?: boolean;
  compact?: boolean;
}

export default function PendingSubscriptionNotification({
  className,
  showDismiss = true,
  compact = false,
}: PendingSubscriptionNotificationProps) {
  const [pendingSubscriptions, setPendingSubscriptions] = useState<PendingSubscription[]>([]);
  const [loading, setLoading] = useState(true);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    loadPendingSubscriptions();
  }, []);

  const loadPendingSubscriptions = async () => {
    setLoading(true);
    try {
      const response = await fetch("/api/subscription-requests");
      if (response.ok) {
        const data = await response.json();
        const pending = data.filter(
          (sub: PendingSubscription) => sub.status === "pending_verification"
        );
        setPendingSubscriptions(pending);
      }
    } catch (error) {
      console.error("Error loading pending subscriptions:", error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending_verification":
        return "bg-yellow-50 border-yellow-200";
      case "verified":
      case "activated":
        return "bg-green-50 border-green-200";
      case "rejected":
        return "bg-red-50 border-red-200";
      default:
        return "bg-gray-50 border-gray-200";
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case "pending_verification":
        return "قيد المراجعة";
      case "verified":
      case "activated":
        return "مقبول";
      case "rejected":
        return "مرفوض";
      default:
        return status;
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "pending_verification":
        return <Clock className="w-5 h-5 text-yellow-600" />;
      case "verified":
      case "activated":
        return <CheckCircle className="w-5 h-5 text-green-600" />;
      case "rejected":
        return <AlertCircle className="w-5 h-5 text-red-600" />;
      default:
        return <AlertCircle className="w-5 h-5 text-gray-600" />;
    }
  };

  if (loading || dismissed || pendingSubscriptions.length === 0) {
    return null;
  }

  if (compact && pendingSubscriptions.length > 0) {
    return (
      <div className={cn(
        "bg-yellow-50 border border-yellow-200 rounded-lg p-4",
        className
      )}>
        <div className="flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
          <div className="flex-1">
            <h3 className="font-semibold text-yellow-900 mb-1">
              {pendingSubscriptions[0]?.userName || "طلب اشتراك"} - قيد المراجعة
            </h3>
            <p className="text-sm text-yellow-700 mb-3">
              لديك {pendingSubscriptions.length} طلب اشتراك في انتظار الموافقة من فريق الإدارة
            </p>
            <a
              href="/settings/subscription-requests"
              className="text-sm font-semibold text-yellow-700 hover:text-yellow-900 inline-flex items-center gap-1"
            >
              عرض التفاصيل
              <span>→</span>
            </a>
          </div>
          {showDismiss && (
            <button
              onClick={() => setDismissed(true)}
              className="text-yellow-700 hover:text-yellow-900 flex-shrink-0"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className={cn("space-y-3", className)}>
      {pendingSubscriptions.map((subscription) => (
        <div
          key={subscription.id}
          className={cn(
            "border rounded-lg p-4 transition-all",
            getStatusColor(subscription.status)
          )}
        >
          <div className="flex items-start gap-3">
            {getStatusIcon(subscription.status)}
            <div className="flex-1">
              <div className="mb-2 flex items-start justify-between gap-2">
                <div>
                  <h3 className="font-semibold text-gray-900">
                    {subscription.userName}
                  </h3>
                  <p className="text-sm text-gray-600">
                    {subscription.clinicName}
                  </p>
                </div>
                <span className={cn(
                  "px-2 py-1 rounded-full text-xs font-semibold flex-shrink-0",
                  subscription.status === "pending_verification" && "bg-yellow-100 text-yellow-700",
                  subscription.status === "verified" && "bg-green-100 text-green-700",
                  subscription.status === "activated" && "bg-green-100 text-green-700",
                  subscription.status === "rejected" && "bg-red-100 text-red-700",
                )}>
                  {getStatusLabel(subscription.status)}
                </span>
              </div>

              <p className="text-sm text-gray-600 mb-3">
                {subscription.status === "pending_verification" && (
                  <>جاري مراجعة طلب الاشتراك رقم {subscription.paymentNumber}. سيتم إشعارك عند الموافقة.</>
                )}
                {subscription.status === "verified" && (
                  <>تمت الموافقة على طلب الاشتراك رقم {subscription.paymentNumber}. يرجى انتظار التفعيل النهائي.</>
                )}
                {subscription.status === "activated" && (
                  <>تم تفعيل الاشتراك رقم {subscription.paymentNumber} بنجاح.</>
                )}
                {subscription.status === "rejected" && (
                  <>تم رفض طلب الاشتراك رقم {subscription.paymentNumber}. السبب: {subscription.rejectionReason}</>
                )}
              </p>

              <div className="grid grid-cols-3 gap-3 mb-3">
                <div className="flex items-center gap-2 text-sm">
                  <span className="text-gray-600">النوع:</span>
                  <span className="font-semibold text-gray-900">{subscription.subscriptionType}</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <DollarSign className="w-4 h-4 text-gray-600" />
                  <span className="font-semibold text-gray-900">
                    {(subscription.amount / 1000).toLocaleString('ar-EG')} ألف د.ع
                  </span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Clock className="w-4 h-4 text-gray-600" />
                  <span className="font-semibold text-gray-900">
                    {subscription.duration} {subscription.duration === 1 ? "شهر" : "أشهر"}
                  </span>
                </div>
              </div>

              {subscription.status === "pending_verification" && (
                <p className="text-xs text-gray-500">
                  تاريخ الطلب: {new Date(subscription.createdAt).toLocaleDateString('ar-EG')}
                </p>
              )}
            </div>

            {showDismiss && (
              <button
                onClick={() => setDismissed(true)}
                className="text-gray-600 hover:text-gray-900 flex-shrink-0"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {subscription.status === "pending_verification" && (
            <div className="mt-3 pt-3 border-t border-yellow-200">
              <p className="text-xs text-yellow-700">
                ⏱️ يتم فحص طلبك بعناية. قد يستغرق الأمر حتى 24 ساعة
              </p>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
