import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Instagram, Facebook, Twitter } from 'lucide-react';

export const Footer = () => {
  return (
    <footer className="bg-primary text-white pt-16 pb-8 px-6">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-12">
        {/* Brand Section */}
        <div className="md:col-span-2">
          <div className="flex items-center gap-4 mb-6">
            <div className="relative w-16 h-16 flex-shrink-0">
              <Image
                src="/logo.png"
                alt="ASEEL Logo"
                fill
                className="object-contain"
              />
            </div>
            <h2 className="text-3xl font-display font-bold">
              أصيل <span className="text-secondary text-sm">LUXURY PERFUMERY</span>
            </h2>
          </div>
          <p className="text-gray-300 max-w-md leading-relaxed">
            نقدم لكم أفخم العطور المستوحاة من أرقى الماركات العالمية، بتركيبات فريدة وجودة استثنائية تعكس أناقتكم وتدوم طويلاً.
          </p>
          <div className="flex gap-4 mt-8">
            <a href="#" className="w-10 h-10 rounded-full border border-gray-600 flex items-center justify-center hover:border-secondary hover:text-secondary transition-all">
              <Instagram size={20} />
            </a>
            <a href="#" className="w-10 h-10 rounded-full border border-gray-600 flex items-center justify-center hover:border-secondary hover:text-secondary transition-all">
              <Facebook size={20} />
            </a>
            <a href="#" className="w-10 h-10 rounded-full border border-gray-600 flex items-center justify-center hover:border-secondary hover:text-secondary transition-all">
              <Twitter size={20} />
            </a>
          </div>
        </div>

        {/* Quick Links */}
        <div>
          <h3 className="text-xl font-display font-bold mb-6 text-secondary">روابط سريعة</h3>
          <ul className="space-y-4">
            <li><Link href="/shop" className="text-gray-300 hover:text-white transition-colors">المتجر</Link></li>
            <li><Link href="/track-order" className="text-gray-300 hover:text-white transition-colors text-secondary font-bold">تتبع طلبك</Link></li>
            <li><Link href="/about" className="text-gray-300 hover:text-white transition-colors">من نحن</Link></li>
            <li><Link href="/contact" className="text-gray-300 hover:text-white transition-colors">تواصل معنا</Link></li>
            <li><Link href="/policy" className="text-gray-300 hover:text-white transition-colors">سياسة الاستبدال</Link></li>
          </ul>
        </div>

        {/* Contact Info */}
        <div>
          <h3 className="text-xl font-display font-bold mb-6 text-secondary">تواصل معنا</h3>
          <ul className="space-y-4 text-gray-300">
            <li>القاهرة، جمهورية مصر العربية</li>
            <li>+20 103 095 0177</li>
            <li>info@aseel-perfumes.com</li>
          </ul>
        </div>
      </div>

      <div className="max-w-7xl mx-auto border-t border-gray-800 mt-16 pt-8 text-center text-gray-500 text-sm">
        <p>© {new Date().getFullYear()} أصيل للعطور الفاخرة. جميع الحقوق محفوظة.</p>
      </div>
    </footer>
  );
};
