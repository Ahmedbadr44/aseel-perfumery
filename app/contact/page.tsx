"use client";

import React, { useState } from "react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { motion } from "motion/react";
import { Phone, Mail, MapPin, MessageCircle, Clock, Send } from "lucide-react";

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    message: ""
  });
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name.trim() || !formData.phone.trim() || !formData.message.trim()) {
      setError("يرجى ملء جميع الحقول");
      return;
    }

    setError("");
    setLoading(true);

    setTimeout(() => {
      setSubmitted(true);
      setLoading(false);
    }, 1500);
  };

  const contactInfo = [
    {
      icon: Phone,
      title: "اتصل بنا",
      content: "01012345678",
      link: "tel:01012345678"
    },
    {
      icon: Mail,
      title: "البريد الإلكتروني",
      content: "info@aseel-perfumery.com",
      link: "mailto:info@aseel-perfumery.com"
    },
    {
      icon: Clock,
      title: "ساعات العمل",
      content: "متاحون على مدار الساعة"
    },
    {
      icon: MapPin,
      title: "العنوان",
      content: "مصر"
    }
  ];

  return (
    <main className="min-h-screen bg-background" dir="rtl">
      <Navbar />

      <div className="pt-32 pb-12 bg-primary text-white text-center px-6">
        <MessageCircle size={48} className="mx-auto mb-4 opacity-80" />
        <h1 className="text-4xl md:text-5xl font-display font-bold mb-4">
          تواصل معنا
        </h1>
        <p className="text-gray-300 max-w-xl mx-auto">
          نحن هنا لمساعدتك، لا تتردد في التواصل معنا لأي استفسار
        </p>
      </div>

      <div className="max-w-4xl mx-auto px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-6"
          >
            <h2 className="text-2xl font-display font-bold text-primary mb-6">
              معلومات التواصل
            </h2>
            {contactInfo.map((item, index) => (
              <div
                key={index}
                className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm flex items-center gap-4"
              >
                <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center flex-shrink-0">
                  <item.icon className="text-primary" size={24} />
                </div>
                <div>
                  <p className="text-sm text-gray-400 mb-1">{item.title}</p>
                  {item.link ? (
                    <a
                      href={item.link}
                      className="text-primary font-bold hover:underline"
                    >
                      {item.content}
                    </a>
                  ) : (
                    <p className="text-primary font-bold">{item.content}</p>
                  )}
                </div>
              </div>
            ))}
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
          >
            {submitted ? (
              <div className="bg-white rounded-3xl shadow-xl border border-gray-100 p-12 text-center">
                <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <MessageCircle className="text-emerald-600" size={40} />
                </div>
                <h3 className="text-2xl font-bold text-primary mb-4">
                  تم إرسال رسالتك بنجاح!
                </h3>
                <p className="text-gray-500 mb-6">
                  شكراً لتواصلك معنا، سنرد عليك في أقرب وقت ممكن
                </p>
                <button
                  onClick={() => {
                    setSubmitted(false);
                    setFormData({ name: "", phone: "", message: "" });
                  }}
                  className="bg-primary text-white px-8 py-3 rounded-xl font-bold hover:bg-primary/90 transition-all"
                >
                  إرسال رسالة أخرى
                </button>
              </div>
            ) : (
              <form
                onSubmit={handleSubmit}
                className="bg-white rounded-3xl shadow-xl border border-gray-100 p-8"
              >
                <h3 className="text-xl font-display font-bold text-primary mb-6">
                  أرسل رسالتك
                </h3>
                
                <div className="space-y-5">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      الاسم
                    </label>
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-secondary focus:ring-2 focus:ring-secondary/20 outline-none transition-all"
                      placeholder="أدخل اسمك"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      رقم الهاتف
                    </label>
                    <input
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-secondary focus:ring-2 focus:ring-secondary/20 outline-none transition-all"
                      placeholder="01xxxxxxxxx"
                      dir="ltr"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      الرسالة
                    </label>
                    <textarea
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      rows={4}
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-secondary focus:ring-2 focus:ring-secondary/20 outline-none transition-all resize-none"
                      placeholder="اكتب رسالتك هنا..."
                    />
                  </div>

                  {error && (
                    <p className="text-red-500 text-sm">{error}</p>
                  )}

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-primary text-white py-4 rounded-xl font-bold hover:bg-primary/90 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                  >
                    <Send size={18} />
                    {loading ? "جاري الإرسال..." : "إرسال الرسالة"}
                  </button>
                </div>
              </form>
            )}
          </motion.div>
        </div>
      </div>

      <Footer />
    </main>
  );
}
