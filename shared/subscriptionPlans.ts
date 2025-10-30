export interface SubscriptionPlan {
  id: number;
  arabicName: string;
  arabicDescription: string;
  price: number;
  durationMonths: number;
  arabicFeatures: string[];
  canBePromoted: boolean;
  maxPriorityLevel: number;
}

export const SUBSCRIPTION_PLANS: SubscriptionPlan[] = [
  {
    id: 1,
    arabicName: "الباقة الأساسية",
    arabicDescription: "مثالية للعيادات الصغيرة",
    price: 100000,
    durationMonths: 1,
    arabicFeatures: [
      "ظهور في نتائج البحث",
      "صفحة عيادة كاملة",
      "إحصائيات أساسية"
    ],
    canBePromoted: false,
    maxPriorityLevel: 0
  },
  {
    id: 2,
    arabicName: "الباقة المميزة",
    arabicDescription: "الأكثر شعبية للعيادات المتوسطة",
    price: 250000,
    durationMonths: 3,
    arabicFeatures: [
      "جميع مزايا الباقة الأساسية",
      "أولوية في البحث",
      "علامة 'مميز'",
      "تقارير متقدمة"
    ],
    canBePromoted: true,
    maxPriorityLevel: 5
  },
  {
    id: 3,
    arabicName: "الباقة الذهبية",
    arabicDescription: "للعيادات الكبرى والمراكز",
    price: 600000,
    durationMonths: 6,
    arabicFeatures: [
      "جميع مزايا الباقة المميزة",
      "ظهور في الصفحة الرئيسية",
      "أولوية قصوى (مستوى 10)",
      "دعم فني مخصص",
      "تحليلات شاملة"
    ],
    canBePromoted: true,
    maxPriorityLevel: 10
  }
];

export const getPlanPrice = (durationMonths: number): number => {
  const plan = SUBSCRIPTION_PLANS.find(p => p.durationMonths === durationMonths);
  return plan?.price || 0;
};

export const getPlanName = (durationMonths: number): string => {
  const plan = SUBSCRIPTION_PLANS.find(p => p.durationMonths === durationMonths);
  return plan?.arabicName || "باقة مخصصة";
};
