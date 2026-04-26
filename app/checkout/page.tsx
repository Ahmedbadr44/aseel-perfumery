'use client';

import React, { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { TrustBar } from '@/components/shared/TrustBar';
import { useCartStore } from '@/lib/store/useCartStore';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import {
  Truck,
  CreditCard,
  ShieldCheck,
  ArrowRight,
  AlertCircle,
  Copy,
  CheckCheck,
  X,
  Banknote,
  MessageCircleMore,
} from 'lucide-react';
import { motion } from 'motion/react';
import Image from 'next/image';
import { GOVERNORATES, CITIES, SHIPPING_RATES } from '@/lib/data/egypt-geo';
import { isCashOnDeliveryAvailable } from '@/lib/data/commerce';

const checkoutSchema = z.object({
  name: z.string().min(3, 'الاسم يجب أن يكون 3 أحرف على الأقل'),
  phone: z.string().regex(/^01[0125][0-9]{8}$/, 'رقم الهاتف يجب أن يكون رقم مصري صحيح (مثال: 01012345678)'),
  governorate: z.string().min(1, 'يرجى اختيار المحافظة'),
  city: z.string().min(1, 'يرجى اختيار المدينة'),
  otherCity: z.string().optional(),
  address: z.string().min(10, 'العنوان يجب أن يكون مفصلًا (10 أحرف على الأقل)'),
  paymentMethod: z.enum(['vodafone_insta', 'cash']),
}).refine((data) => {
  if (data.city === 'other') {
    return !!data.otherCity && data.otherCity.trim().length >= 2;
  }
  return true;
}, {
  message: 'يرجى كتابة اسم مدينتك أو منطقتك',
  path: ['otherCity']
});

type CheckoutForm = z.infer<typeof checkoutSchema>;

export default function CheckoutPage() {
  const router = useRouter();
  const { items, getTotal, clearCart } = useCartStore();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [pendingWhatsAppUrl, setPendingWhatsAppUrl] = useState('');
  const [orderId, setOrderId] = useState('');
  const [orderTotal, setOrderTotal] = useState(0);
  const [copied, setCopied] = useState(false);
  const idempotencyKey = useMemo(() => crypto.randomUUID(), []);

  const VODAFONE_NUMBER = '01030950177';

  const copyNumber = () => {
    navigator.clipboard.writeText(VODAFONE_NUMBER);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const confirmTransferAndOpenWhatsApp = () => {
    setShowPaymentModal(false);
    window.open(pendingWhatsAppUrl, '_blank');
    clearCart();
    router.push(`/order-confirmation/${orderId}`);
  };

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    setValue,
  } = useForm<CheckoutForm>({
    resolver: zodResolver(checkoutSchema),
    defaultValues: { paymentMethod: 'vodafone_insta' },
  });

  const selectedPaymentMethod = watch('paymentMethod');
  const selectedGovernorate = watch('governorate');
  const cashOnDeliveryAvailable = isCashOnDeliveryAvailable(selectedGovernorate);

  useEffect(() => {
    if (!cashOnDeliveryAvailable && selectedPaymentMethod === 'cash') {
      setValue('paymentMethod', 'vodafone_insta');
    }
  }, [cashOnDeliveryAvailable, selectedPaymentMethod, setValue]);

  const shippingCost = selectedGovernorate
    ? (selectedGovernorate === 'beheira' && watch('city') === 'النوبارية'
        ? 0
        : (SHIPPING_RATES[selectedGovernorate] ?? 100))
    : 0;
  const subtotal = getTotal();
  const finalTotal = subtotal + shippingCost;

  const onSubmit = async (data: CheckoutForm) => {
    if (items.length === 0) {
      setError('سلة التسوق فارغة');
      return;
    }

    setIsSubmitting(true);
    setError('');

    try {
      const governorateName = GOVERNORATES.find(g => g.id === data.governorate)?.name || data.governorate;
      const cityName = data.city === 'other' ? (data.otherCity || 'أخرى') : data.city;

      const orderData = {
        customer_name: data.name,
        phone: data.phone,
        governorate: governorateName,
        governorate_id: data.governorate,
        city: cityName,
        address: data.address,
        items: items.map((item) => ({ id: item.id, quantity: item.quantity, size: item.size })),
        payment_method: data.paymentMethod,
        idempotency_key: idempotencyKey,
      };

      const response = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(orderData),
      });
      const payload = await response.json();
      if (!response.ok || !payload.orderId) {
        throw new Error(payload?.error || 'ORDER_CREATE_FAILED');
      }
      const createdOrderId = payload.orderId as string;
      const serverTotal = Number(payload.total || finalTotal);
      setOrderId(createdOrderId);

      if (data.paymentMethod === 'cash') {
        clearCart();
        router.push(`/order-confirmation/${createdOrderId}`);
        return;
      }

      const waNumber = '201030950177';
      const orderMessage = encodeURIComponent(
        `*طلب جديد من متجر أصيل*\n\n` +
        `*بيانات العميل:*\n` +
        `• رقم الطلب: \`${createdOrderId}\`\n` +
        `• الاسم: ${data.name}\n` +
        `• الهاتف: ${data.phone}\n` +
        `• المحافظة: ${governorateName}\n` +
        `• المدينة: ${cityName}\n` +
        `• العنوان: ${data.address}\n\n` +
        `*تفاصيل الدفع:*\n` +
        `• الإجمالي الفرعي: ${subtotal} جنيه\n` +
        `• مصاريف الشحن: ${shippingCost === 0 ? 'مجاني' : `${shippingCost} جنيه`}\n` +
        `• الإجمالي النهائي: *${serverTotal} جنيه*\n` +
        `• طريقة الدفع: فودافون كاش / انستا باي\n\n` +
        `ارسل التأكيد هنا `
      );
      const waUrl = `https://wa.me/${waNumber}?text=${orderMessage}`;

      setOrderTotal(serverTotal);
      setPendingWhatsAppUrl(waUrl);
      setShowPaymentModal(true);
    } catch (err: any) {
      console.error('Error placing order:', err?.message || err, err);
      setError('حدث خطأ أثناء إتمام الطلب، يرجى المحاولة لاحقًا');
    } finally {
      setIsSubmitting(false);
    }
  };

  const PaymentModal = () => showPaymentModal ? (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="fixed inset-0 z-[9999] flex items-center justify-center p-4"
      style={{ backgroundColor: 'rgba(0,0,0,0.75)', backdropFilter: 'blur(8px)' }}
    >
      <motion.div
        initial={{ scale: 0.85, opacity: 0, y: 30 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        transition={{ type: 'spring', stiffness: 300, damping: 25 }}
        className="bg-white rounded-3xl shadow-2xl max-w-sm w-full overflow-hidden"
      >
        <div className="bg-gradient-to-r from-red-600 to-red-500 p-6 text-white text-center relative">
          <button
            onClick={() => setShowPaymentModal(false)}
            className="absolute top-4 left-4 w-8 h-8 bg-white/20 rounded-full flex items-center justify-center hover:bg-white/30 transition-all"
          >
            <X size={16} />
          </button>
          <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-3">
            <CreditCard size={32} />
          </div>
          <h2 className="text-xl font-bold">أكمل عملية الدفع</h2>
          <p className="text-red-100 text-sm mt-1">فودافون كاش / انستا باي</p>
        </div>

        <div className="p-6 space-y-5">
          <div className="bg-gray-50 rounded-2xl p-4 text-center">
            <p className="text-xs text-gray-500 mb-1">المبلغ المطلوب تحويله</p>
            <p className="text-4xl font-bold text-primary">{orderTotal}</p>
            <p className="text-gray-500 text-sm">جنيه مصري</p>
          </div>

          <div className="bg-red-50 border border-red-100 rounded-2xl p-4">
            <p className="text-xs text-gray-500 mb-2">حوّل إلى رقم فودافون كاش</p>
            <div className="flex items-center justify-between">
              <p className="text-2xl font-bold text-primary tracking-widest">{VODAFONE_NUMBER}</p>
              <button
                onClick={copyNumber}
                className="flex items-center gap-1 bg-red-600 text-white text-xs px-3 py-2 rounded-xl hover:bg-red-700 transition-all"
              >
                {copied ? <CheckCheck size={14} /> : <Copy size={14} />}
                {copied ? 'تم النسخ' : 'نسخ'}
              </button>
            </div>
          </div>

          <div className="space-y-2">
            {[
              'افتح تطبيق فودافون كاش أو البنك',
              'حوّل المبلغ إلى الرقم أعلاه',
              'التقط صورة لشاشة التأكيد',
              'اضغط الزر أدناه وأرسل صورة التحويل عبر واتساب',
            ].map((step, i) => (
              <div key={i} className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-primary text-white text-xs flex items-center justify-center flex-shrink-0 mt-0.5 font-bold">
                  {i + 1}
                </div>
                <p className="text-sm text-gray-600">{step}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="px-6 pb-6">
          <button
            onClick={confirmTransferAndOpenWhatsApp}
            className="w-full py-4 rounded-2xl font-bold text-white text-base flex items-center justify-center gap-2 transition-all shadow-lg"
            style={{ background: 'linear-gradient(135deg, #25D366, #128C7E)' }}
          >
            <svg viewBox="0 0 24 24" className="w-5 h-5 fill-current" xmlns="http://www.w3.org/2000/svg">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L0 24l6.335-1.662c1.72.937 3.659 1.431 5.633 1.433h.005c6.554 0 11.89-5.335 11.893-11.892a11.826 11.826 0 00-3.48-8.413z" />
            </svg>
            لقد أرسلت التحويل - فتح واتساب
          </button>
          <p className="text-center text-xs text-gray-400 mt-3">
            سيتم فتح واتساب لإرسال صورة التحويل وتفاصيل طلبك
          </p>
        </div>
      </motion.div>
    </motion.div>
  ) : null;

  return (
    <main className="min-h-screen bg-background">
      <PaymentModal />
      <Navbar />
      <TrustBar />

      <div className="pt-32 pb-24 max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
          <div>
            <h1 className="text-3xl font-display font-bold text-primary mb-8">تفاصيل الشحن</h1>

            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl flex items-center gap-3 text-red-600"
              >
                <AlertCircle size={20} />
                <span className="text-sm">{error}</span>
              </motion.div>
            )}

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              <div className="space-y-2">
                <label className="text-sm font-bold text-gray-700 block">الاسم بالكامل</label>
                <input
                  {...register('name')}
                  className={`w-full px-6 py-4 rounded-2xl border ${errors.name ? 'border-red-500' : 'border-gray-200'} outline-none focus:border-secondary transition-all bg-white`}
                  placeholder="أدخل اسمك الثلاثي"
                />
                {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name.message}</p>}
              </div>

              <div className="space-y-2">
                <label className="text-sm font-bold text-gray-700 block">رقم الهاتف</label>
                <input
                  {...register('phone')}
                  className={`w-full px-6 py-4 rounded-2xl border ${errors.phone ? 'border-red-500' : 'border-gray-200'} outline-none focus:border-secondary transition-all bg-white`}
                  placeholder="01xxxxxxxxx"
                />
                {errors.phone && <p className="text-red-500 text-xs mt-1">{errors.phone.message}</p>}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-bold text-gray-700 block">المحافظة</label>
                  <select
                    {...register('governorate')}
                    className={`w-full px-6 py-4 rounded-2xl border ${errors.governorate ? 'border-red-500' : 'border-gray-200'} outline-none focus:border-secondary transition-all bg-white`}
                  >
                    <option value="">اختر المحافظة</option>
                    {GOVERNORATES.map(gov => (
                      <option key={gov.id} value={gov.id}>{gov.name}</option>
                    ))}
                  </select>
                  {errors.governorate && <p className="text-red-500 text-xs mt-1">{errors.governorate.message}</p>}
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-bold text-gray-700 block">المدينة / المنطقة</label>
                  <select
                    {...register('city')}
                    className={`w-full px-6 py-4 rounded-2xl border ${errors.city ? 'border-red-500' : 'border-gray-200'} outline-none focus:border-secondary transition-all bg-white`}
                  >
                    <option value="">اختر المدينة</option>
                    {watch('governorate') && CITIES[watch('governorate')] && (
                      CITIES[watch('governorate')].map(city => (
                        <option key={city} value={city}>{city}</option>
                      ))
                    )}
                    <option value="other">مدينة أخرى (سأكتبها بنفسي)</option>
                  </select>
                  {errors.city && <p className="text-red-500 text-xs mt-1">{errors.city.message}</p>}

                  {watch('city') === 'other' && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      className="mt-4 space-y-2"
                    >
                      <label className="text-sm font-bold text-gray-700 block">اكتب اسم مدينتك / منطقتك</label>
                      <input
                        {...register('otherCity')}
                        className={`w-full px-6 py-4 rounded-2xl border ${errors.otherCity ? 'border-red-500' : 'border-gray-200'} outline-none focus:border-secondary transition-all bg-white`}
                        placeholder="مثال: مركز ديرب نجم، قرية كذا..."
                      />
                      {errors.otherCity && <p className="text-red-500 text-xs mt-1">{errors.otherCity.message}</p>}
                    </motion.div>
                  )}
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-bold text-gray-700 block">العنوان بالتفصيل</label>
                <textarea
                  {...register('address')}
                  rows={4}
                  className={`w-full px-6 py-4 rounded-2xl border ${errors.address ? 'border-red-500' : 'border-gray-200'} outline-none focus:border-secondary transition-all bg-white resize-none`}
                  placeholder="رقم العمارة، اسم الشارع، علامة مميزة..."
                />
                {errors.address && <p className="text-red-500 text-xs mt-1">{errors.address.message}</p>}
              </div>

              <div className="space-y-3">
                <label className="text-sm font-bold text-gray-700 block">طريقة الدفع</label>
                <div className="space-y-2">
                  <label className="flex items-center p-4 border border-gray-200 rounded-2xl cursor-pointer hover:bg-gray-50 transition-all">
                    <input
                      type="radio"
                      {...register('paymentMethod')}
                      value="vodafone_insta"
                      className="w-4 h-4"
                    />
                    <div className="mr-4 flex items-center gap-3">
                      <div className="w-10 h-10 bg-red-100 text-red-600 rounded-lg flex items-center justify-center">
                        <CreditCard size={20} />
                      </div>
                      <div>
                        <p className="font-bold text-primary">فودافون كاش / انستا باي</p>
                        <p className="text-xs text-gray-500">تحويل سريع وآمن مع تأكيد الطلب عبر واتساب</p>
                      </div>
                    </div>
                  </label>

                  <label
                    className={`flex items-center p-4 border rounded-2xl transition-all ${
                      cashOnDeliveryAvailable
                        ? 'border-gray-200 cursor-pointer hover:bg-gray-50'
                        : 'border-gray-100 bg-gray-50 cursor-not-allowed opacity-60'
                    }`}
                  >
                    <input
                      type="radio"
                      {...register('paymentMethod')}
                      value="cash"
                      className="w-4 h-4"
                      disabled={!cashOnDeliveryAvailable}
                    />
                    <div className="mr-4 flex items-center gap-3">
                      <div className="w-10 h-10 bg-emerald-100 text-emerald-600 rounded-lg flex items-center justify-center">
                        <Banknote size={20} />
                      </div>
                      <div>
                        <p className="font-bold text-primary">الدفع عند الاستلام</p>
                        <p className="text-xs text-gray-500">
                          {cashOnDeliveryAvailable
                            ? 'متاح لهذه المحافظة وسيتم تأكيد الطلب قبل الشحن'
                            : 'يتفعّل فقط في المحافظات المؤهلة حاليًا'}
                        </p>
                      </div>
                    </div>
                  </label>
                </div>
              </div>

              {selectedPaymentMethod === 'vodafone_insta' ? (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  className="bg-red-50 p-6 rounded-2xl border border-red-200 space-y-4"
                >
                  <p className="font-bold text-red-800 text-sm">تعليمات الدفع:</p>
                  <div className="flex items-center justify-between bg-white p-4 rounded-xl border border-red-100">
                    <div>
                      <p className="text-xs text-gray-500">الرقم المحمول</p>
                      <p className="text-xl font-bold text-primary tracking-wider">01030950177</p>
                    </div>
                    <div className="bg-red-600 text-white px-3 py-1 rounded-lg text-xs font-bold">
                      فودافون كاش
                    </div>
                  </div>
                  <ul className="text-xs text-red-700 space-y-2 list-disc pr-4">
                    <li>قم بتحويل المبلغ الإجمالي إلى الرقم الموضح أعلاه.</li>
                    <li>التقط صورة لشاشة التأكيد بعد التحويل.</li>
                    <li>بعد الضغط على تأكيد الطلب سيفتح واتساب لإرسال صورة التحويل.</li>
                  </ul>
                </motion.div>
              ) : (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  className="bg-emerald-50 p-6 rounded-2xl border border-emerald-200 space-y-4"
                >
                  <p className="font-bold text-emerald-800 text-sm">ماذا يحدث بعد إرسال الطلب؟</p>
                  <ul className="text-xs text-emerald-700 space-y-2 list-disc pr-4">
                    <li>نراجع الطلب ونتواصل معك سريعًا لتأكيد البيانات.</li>
                    <li>يتم الدفع عند الاستلام للمحافظة المختارة.</li>
                    <li>مدة التوصيل المعتادة من 2 إلى 4 أيام عمل.</li>
                  </ul>
                </motion.div>
              )}

              <a
                href="https://wa.me/201030950177?text=%D9%85%D8%B1%D8%AD%D8%A8%D8%A7%D9%8B%D8%8C%20%D8%A3%D8%AD%D8%AA%D8%A7%D8%AC%20%D9%85%D8%B3%D8%A7%D8%B9%D8%AF%D8%A9%20%D9%81%D9%8A%20%D8%A5%D8%AA%D9%85%D8%A7%D9%85%20%D8%A7%D9%84%D8%B7%D9%84%D8%A8"
                target="_blank"
                rel="noopener noreferrer"
                className="w-full border border-[#25D366] text-[#128C7E] py-4 rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-[#25D366] hover:text-white transition-all"
              >
                <MessageCircleMore size={18} />
                محتاج مساعدة سريعة؟ تواصل واتساب
              </a>

              <button
                type="submit"
                disabled={isSubmitting || items.length === 0}
                className="w-full bg-primary text-white py-5 rounded-full font-bold text-lg hover:bg-primary/90 transition-all shadow-xl disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3"
              >
                {isSubmitting ? 'جاري إتمام الطلب...' : 'تأكيد الطلب'}
                {!isSubmitting && <ArrowRight size={20} />}
              </button>
            </form>
          </div>

          <div className="lg:pl-12">
            <div className="bg-white p-8 rounded-3xl shadow-xl border border-gray-100 sticky top-32">
              <h2 className="text-2xl font-display font-bold text-primary mb-8 border-b pb-4">ملخص الطلب</h2>

              <div className="max-h-[300px] overflow-y-auto mb-8 space-y-4 pr-2">
                {items.map((item) => (
                  <div key={item.cartItemId} className="flex items-center gap-4">
                    <div className="relative w-16 h-20 rounded-lg overflow-hidden flex-shrink-0 border border-gray-100">
                      <Image src={item.image} alt={item.name} fill className="object-cover" />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-bold text-primary text-sm">{item.name}</h4>
                      <p className="text-gray-400 text-xs">حجم: {item.size} | الكمية: {item.quantity}</p>
                    </div>
                    <p className="font-bold text-primary text-sm">{item.price * item.quantity} جنيه</p>
                  </div>
                ))}
              </div>

              <div className="space-y-4 border-t pt-6">
                <div className="flex justify-between text-gray-600">
                  <span>الإجمالي الفرعي</span>
                  <span>{subtotal} جنيه</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>مصاريف الشحن</span>
                  {shippingCost === 0 ? (
                    <span className="text-emerald-600 font-bold">مجاني</span>
                  ) : (
                    <span className="font-bold text-primary">{shippingCost} جنيه</span>
                  )}
                </div>
                <div className="flex justify-between text-xl font-bold text-primary pt-4 border-t border-dashed">
                  <span>الإجمالي النهائي</span>
                  <span>{finalTotal} جنيه</span>
                </div>
              </div>

              <div className="mt-10 space-y-4">
                <div className="flex items-center gap-3 text-gray-500 text-sm">
                  <Truck size={18} className="text-secondary" />
                  <span>توصيل خلال 2-4 أيام عمل</span>
                </div>
                <div className="flex items-center gap-3 text-gray-500 text-sm">
                  <ShieldCheck size={18} className="text-secondary" />
                  <span>ضمان جودة المنتج 100%</span>
                </div>
                <div className="flex items-center gap-3 text-gray-500 text-sm">
                  <CreditCard size={18} className="text-secondary" />
                  <span>{cashOnDeliveryAvailable ? 'الدفع عند الاستلام متاح لهذه المحافظة' : 'يمكنك إتمام الطلب الآن بالتحويل الآمن'}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </main>
  );
}
