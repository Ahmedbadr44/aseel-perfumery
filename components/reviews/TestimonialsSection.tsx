'use client';

import React, { FormEvent, useEffect, useState } from 'react';
import Link from 'next/link';
import { Loader2, MessageCircleMore, Star } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

interface Testimonial {
  id: string;
  product_name: string;
  user_name: string;
  rating: number;
  comment: string;
}

interface TestimonialsSectionProps {
  productId: string;
  productName: string;
}

export function TestimonialsSection({ productId, productName }: TestimonialsSectionProps) {
  const { user, userProfile } = useAuth();
  const [items, setItems] = useState<Testimonial[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [summary, setSummary] = useState({ count: 0, average: 0 });

  useEffect(() => {
    if (!productId) return;

    const loadTestimonials = async () => {
      try {
        setLoading(true);
        setError('');
        const response = await fetch(`/api/testimonials?productId=${productId}&limit=6`);
        const payload = await response.json();
        if (!response.ok) {
          throw new Error(payload?.error || 'LOAD_FAILED');
        }
        setItems(payload.testimonials || []);
        setSummary(payload.summary || { count: 0, average: 0 });
      } catch (loadError) {
        console.error('Error loading testimonials:', loadError);
        setError('تعذر تحميل آراء العملاء حاليًا.');
      } finally {
        setLoading(false);
      }
    };

    loadTestimonials();
  }, [productId]);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError('');
    setSuccess('');

    if (!user) {
      setError('سجل دخولك أولًا حتى تتمكن من كتابة تقييمك.');
      return;
    }

    if (comment.trim().length < 10) {
      setError('يرجى كتابة رأي واضح من 10 أحرف على الأقل.');
      return;
    }

    try {
      setSubmitting(true);
      const token = await user.getIdToken();
      const response = await fetch('/api/testimonials', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          productId,
          productName,
          rating,
          comment: comment.trim(),
        }),
      });
      const payload = await response.json();
      if (!response.ok) {
        throw new Error(payload?.error || 'SUBMIT_FAILED');
      }

      setComment('');
      setRating(5);
      setSuccess('تم إرسال تقييمك بنجاح وسيظهر مباشرة ضمن آراء العملاء.');

      const refreshResponse = await fetch(`/api/testimonials?productId=${productId}&limit=6`);
      const refreshPayload = await refreshResponse.json();
      if (!refreshResponse.ok) {
        throw new Error(refreshPayload?.error || 'REFRESH_FAILED');
      }
      setItems(refreshPayload.testimonials || []);
      setSummary(refreshPayload.summary || { count: 0, average: 0 });
    } catch (submitError: any) {
      setError(submitError?.message || 'تعذر إرسال تقييمك حاليًا.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section className="mt-24">
      <div className="flex flex-col lg:flex-row gap-8 items-start">
        <div className="lg:w-1/3 bg-white rounded-3xl border border-gray-100 p-8 shadow-sm">
          <span className="text-secondary font-medium tracking-widest mb-3 block">آراء المشترين</span>
          <h2 className="text-3xl font-display font-bold text-primary mb-4">تجارب حقيقية من عملاء أصيل</h2>
          <p className="text-gray-500 leading-7 mb-6">
            الآراء هنا يكتبها العملاء المسجلون لتساعد المشتري الجديد على اتخاذ القرار بثقة أكبر.
          </p>

          <div className="bg-background rounded-2xl p-5 mb-6">
            <p className="text-sm text-gray-500 mb-1">متوسط التقييم</p>
            <div className="flex items-center gap-3">
              <span className="text-4xl font-bold text-primary">{summary.average.toFixed(1)}</span>
              <div>
                <div className="flex items-center gap-1 text-secondary mb-1">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star
                      key={i}
                      size={16}
                      className={i < Math.round(summary.average) ? 'fill-current' : 'text-gray-300'}
                    />
                  ))}
                </div>
                <p className="text-xs text-gray-400">{summary.count} تقييم</p>
              </div>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="text-sm font-bold text-gray-700 block mb-2">تقييمك</label>
              <div className="flex items-center gap-2">
                {Array.from({ length: 5 }).map((_, i) => {
                  const value = i + 1;
                  return (
                    <button
                      key={value}
                      type="button"
                      onClick={() => setRating(value)}
                      className="text-secondary"
                    >
                      <Star size={22} className={value <= rating ? 'fill-current' : 'text-gray-300'} />
                    </button>
                  );
                })}
              </div>
            </div>

            <div>
              <label className="text-sm font-bold text-gray-700 block mb-2">اكتب تجربتك</label>
              <textarea
                value={comment}
                onChange={(event) => setComment(event.target.value)}
                rows={4}
                className="w-full px-5 py-4 rounded-2xl border border-gray-200 outline-none focus:border-secondary transition-all resize-none"
                placeholder="كيف كان الثبات؟ وهل الفوحان مناسب؟ وما هو أفضل وقت لاستخدامه؟"
              />
            </div>

            {error && <p className="text-sm text-red-500">{error}</p>}
            {success && <p className="text-sm text-emerald-600">{success}</p>}

            {user ? (
              <button
                type="submit"
                disabled={submitting}
                className="w-full bg-primary text-white py-4 rounded-2xl font-bold hover:bg-primary/90 transition-all disabled:opacity-60 flex items-center justify-center gap-2"
              >
                {submitting ? <Loader2 size={18} className="animate-spin" /> : null}
                أرسل تقييمك
              </button>
            ) : (
              <Link
                href="/login"
                className="w-full bg-primary text-white py-4 rounded-2xl font-bold hover:bg-primary/90 transition-all flex items-center justify-center gap-2"
              >
                سجّل الدخول لكتابة تقييمك
              </Link>
            )}

            <p className="text-xs text-gray-400">
              {user
                ? `سيظهر اسمك كما هو مسجل في حسابك: ${userProfile?.display_name || user.displayName || user.email}`
                : 'يمكن فقط للمستخدمين المسجلين كتابة التقييمات.'}
            </p>
          </form>
        </div>

        <div className="lg:flex-1 grid grid-cols-1 md:grid-cols-2 gap-5 w-full">
          {loading ? (
            Array.from({ length: 4 }).map((_, index) => (
              <div key={index} className="animate-pulse bg-white rounded-3xl border border-gray-100 p-6 h-52" />
            ))
          ) : items.length > 0 ? (
            items.map((item) => (
              <article key={item.id} className="bg-white rounded-3xl border border-gray-100 p-6 shadow-sm">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-1 text-secondary">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star
                        key={i}
                        size={16}
                        className={i < item.rating ? 'fill-current' : 'text-gray-300'}
                      />
                    ))}
                  </div>
                  <MessageCircleMore size={18} className="text-secondary/60" />
                </div>
                <p className="text-gray-600 leading-7 mb-5">{item.comment}</p>
                <div className="border-t border-gray-100 pt-4">
                  <p className="font-bold text-primary">{item.user_name}</p>
                  <p className="text-xs text-gray-400 mt-1">{item.product_name}</p>
                </div>
              </article>
            ))
          ) : (
            <div className="bg-white rounded-3xl border border-dashed border-gray-200 p-10 text-center md:col-span-2">
              <h3 className="text-xl font-display font-bold text-primary mb-3">كن أول من يكتب تجربته</h3>
              <p className="text-gray-500">ابدأ أول تقييم لهذا العطر وساعد العملاء الآخرين في اختيارهم.</p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
