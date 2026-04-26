export const CASH_ON_DELIVERY_GOVERNORATES = [
  "beheira",
  "alexandria",
  "kafr_el_sheikh",
  "gharbia",
  "monufia",
  "dakahlia",
  "cairo",
  "giza",
  "qalyubia",
  "sharqia",
  "damietta",
] as const;

export function isCashOnDeliveryAvailable(governorateId?: string) {
  return !!governorateId && CASH_ON_DELIVERY_GOVERNORATES.includes(governorateId as (typeof CASH_ON_DELIVERY_GOVERNORATES)[number]);
}

export const STORE_TRUST_POINTS = [
  {
    title: "شحن سريع",
    description: "توصيل خلال 2-4 أيام عمل لمعظم المحافظات",
  },
  {
    title: "جودة مضمونة",
    description: "استبدال سريع إذا وصل المنتج بحالة غير سليمة",
  },
  {
    title: "مساعدة فورية",
    description: "دعم واتساب للترشيح والمتابعة قبل وبعد الطلب",
  },
];

export const PRODUCT_SIZE_GUIDE = [
  {
    size: "30ml",
    label: "تجربة أولى",
    description: "أفضل اختيار إذا كنت تريد تجربة العطر قبل الحجم الأكبر.",
  },
  {
    size: "50ml",
    label: "الأكثر طلبًا",
    description: "توازن ممتاز بين السعر والاستخدام اليومي ويصلح كهدية أيضًا.",
  },
  {
    size: "100ml",
    label: "أفضل قيمة",
    description: "مناسب للاستخدام المتكرر ويوفر قيمة أعلى على المدى الطويل.",
  },
] as const;
