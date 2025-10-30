import React, { useState } from "react";
import { Bell, MessageCircle, CheckSquare, Clock, ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";
import CardBasedNotifications from "@/components/CardBasedNotifications";
import NotificationBell from "@/components/NotificationBell";
import { sampleNotifications } from "@/data/sampleNotifications";

export default function NotificationsDemo() {
  const [showNotifications, setShowNotifications] = useState(false);
  
  const unreadMessages = sampleNotifications.filter(n => n.type === "message" && !n.read).length;
  const unreadTasks = sampleNotifications.filter(n => n.type === "task" && !n.read).length;
  const unreadReminders = sampleNotifications.filter(n => n.type === "reminder" && !n.read).length;

  const stats = [
    {
      label: "الرسائل",
      count: unreadMessages,
      total: sampleNotifications.filter(n => n.type === "message").length,
      icon: MessageCircle,
      color: "bg-blue-500",
    },
    {
      label: "المهام",
      count: unreadTasks,
      total: sampleNotifications.filter(n => n.type === "task").length,
      icon: CheckSquare,
      color: "bg-purple-500",
    },
    {
      label: "التذكيرات",
      count: unreadReminders,
      total: sampleNotifications.filter(n => n.type === "reminder").length,
      icon: Clock,
      color: "bg-orange-500",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-4">
              <Link 
                to="/"
                className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
              >
                <ArrowLeft className="w-5 h-5" />
                <span className="text-sm font-medium">الرئيسية</span>
              </Link>
              <h1 className="text-2xl font-bold text-gray-900">
                نظام الإشعارات الجديد
              </h1>
            </div>

            <NotificationBell notifications={sampleNotifications} />
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <div className="inline-block p-4 bg-blue-100 rounded-2xl mb-4">
            <Bell className="w-12 h-12 text-blue-600" />
          </div>
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            نظام الإشعارات المتكامل
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            نظام إشعارات ذكي مبني على البطاقات مع تنقل تلقائي للأقسام المختلفة
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          {stats.map((stat) => {
            const Icon = stat.icon;
            return (
              <div
                key={stat.label}
                className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100"
              >
                <div className="flex items-center justify-between mb-4">
                  <div className={`p-3 rounded-xl ${stat.color} bg-opacity-10`}>
                    <Icon className={`w-6 h-6 ${stat.color.replace('bg-', 'text-')}`} />
                  </div>
                  {stat.count > 0 && (
                    <span className="bg-red-500 text-white text-xs font-bold px-2.5 py-1 rounded-full">
                      {stat.count} جديد
                    </span>
                  )}
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-1">
                  {stat.total}
                </h3>
                <p className="text-sm text-gray-600">{stat.label}</p>
              </div>
            );
          })}
        </div>

        {/* Features */}
        <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100 mb-12">
          <h3 className="text-2xl font-bold text-gray-900 mb-6">
            ✨ الميزات الرئيسية
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0 w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                <MessageCircle className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <h4 className="font-semibold text-gray-900 mb-1">
                  تنقل ذكي للرسائل
                </h4>
                <p className="text-sm text-gray-600">
                  الضغط على إشعار الرسالة يُنقلك مباشرة للمحادثة مع المرسل
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="flex-shrink-0 w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                <CheckSquare className="w-5 h-5 text-purple-600" />
              </div>
              <div>
                <h4 className="font-semibold text-gray-900 mb-1">
                  تنقل ذكي للمهام
                </h4>
                <p className="text-sm text-gray-600">
                  الضغط على إشعار المهمة يُنقلك مباشرة لصفحة المهام
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="flex-shrink-0 w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
                <Clock className="w-5 h-5 text-orange-600" />
              </div>
              <div>
                <h4 className="font-semibold text-gray-900 mb-1">
                  تنقل ذكي للتذكيرات
                </h4>
                <p className="text-sm text-gray-600">
                  الضغط على إشعار التذكير يُنقلك مباشرة لصفحة التذكيرات
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="flex-shrink-0 w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                <Bell className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <h4 className="font-semibold text-gray-900 mb-1">
                  بطاقات تفاعلية
                </h4>
                <p className="text-sm text-gray-600">
                  تصميم card-based حديث مع معلومات شاملة وأولويات ملونة
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* CTA Button */}
        <div className="text-center">
          <button
            onClick={() => setShowNotifications(true)}
            className="inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl font-semibold text-lg shadow-xl hover:shadow-2xl transition-all hover:scale-105"
          >
            <Bell className="w-6 h-6" />
            فتح نظام الإشعارات
          </button>
        </div>

        {/* Instructions */}
        <div className="mt-12 bg-gradient-to-br from-blue-50 to-purple-50 rounded-2xl p-8 border border-blue-100">
          <h3 className="text-xl font-bold text-gray-900 mb-4">
            📝 طريقة الاستخدام
          </h3>
          <ul className="space-y-3 text-gray-700">
            <li className="flex items-start gap-3">
              <span className="flex-shrink-0 w-6 h-6 bg-blue-500 text-white rounded-full flex items-center justify-center text-sm font-bold">1</span>
              <span>اضغط على زر الإشعارات أعلى الصفحة أو الزر الأزرق في الأسفل</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="flex-shrink-0 w-6 h-6 bg-blue-500 text-white rounded-full flex items-center justify-center text-sm font-bold">2</span>
              <span>استخدم الفلاتر لعرض إشعارات محددة (رسائل، مهام، تذكيرات، إلخ)</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="flex-shrink-0 w-6 h-6 bg-blue-500 text-white rounded-full flex items-center justify-center text-sm font-bold">3</span>
              <span>اضغط على أي إشعار للانتقال التلقائي للقسم المرتبط به</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="flex-shrink-0 w-6 h-6 bg-blue-500 text-white rounded-full flex items-center justify-center text-sm font-bold">4</span>
              <span>استخدم البحث للعثور على إشعارات محددة بسرعة</span>
            </li>
          </ul>
        </div>
      </main>

      {/* Notification System */}
      <CardBasedNotifications
        isOpen={showNotifications}
        onClose={() => setShowNotifications(false)}
        notifications={sampleNotifications}
      />
    </div>
  );
}
