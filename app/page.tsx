import { Navbar } from "@/components/layout/Navbar";
import { Hero } from "@/components/home/Hero";
import { Footer } from "@/components/layout/Footer";
import { BestSellers } from "@/components/home/BestSellers";
import Image from "next/image";
import Link from "next/link";

export default function Home() {
  return (
    <main className="flex flex-col min-h-screen">
      <Navbar />
      <Hero />
      
      {/* Best Sellers Section */}
      <section className="py-24 px-6 bg-white overflow-hidden">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-display font-bold text-primary mb-4">الأكثر مبيعاً</h2>
            <div className="w-24 h-1 bg-secondary mx-auto"></div>
            <p className="text-gray-500 mt-6 max-w-2xl mx-auto">
              مجموعة مختارة من أرقى عطورنا التي نالت إعجاب عملائنا وأصبحت بصمة مميزة لهم.
            </p>
          </div>
          
          <BestSellers />
          
          <div className="text-center mt-16">
            <Link
              href="/shop"
              className="inline-block border-2 border-primary text-primary px-12 py-3 rounded-full font-bold hover:bg-primary hover:text-white transition-all"
            >
              عرض جميع المنتجات
            </Link>
          </div>
        </div>
      </section>

      {/* Brand Story Section */}
      <section className="py-24 px-6 bg-background relative overflow-hidden">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div className="relative aspect-square rounded-2xl overflow-hidden shadow-2xl">
            <Image
              src="https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?w=800&q=80"
              alt="Brand Story"
              fill
              className="object-cover"
            />
          </div>
          <div>
            <span className="text-secondary font-medium tracking-widest mb-4 block">قصتنا</span>
            <h2 className="text-4xl font-display font-bold text-primary mb-8 leading-tight">
              نحن نؤمن أن العطر ليس مجرد رائحة، <br />
              بل هو <span className="text-secondary">هوية وذكرى</span>
            </h2>
            <p className="text-gray-600 mb-6 leading-relaxed">
              بدأت رحلة أصيل بشغف عميق لفن صناعة العطور، حيث سعينا لتقديم تجربة عطرية فاخرة تجمع بين الجودة العالية والسعر المناسب. كل زجاجة عطر من أصيل هي نتيجة شهور من البحث والتطوير للوصول إلى التوازن المثالي.
            </p>
            <p className="text-gray-600 mb-10 leading-relaxed">
              نحن نستخدم أجود الزيوت العطرية العالمية لنضمن لكم ثباتاً يدوم طويلاً وفوحاناً يأسر الحواس، مستلهمين إبداعاتنا من أشهر الماركات العالمية مع إضافة لمستنا الشرقية الخاصة.
            </p>
            <div className="grid grid-cols-3 gap-8 text-center">
              <div>
                <p className="text-3xl font-display font-bold text-primary">+50</p>
                <p className="text-xs text-gray-500 mt-1">عطر فريد</p>
              </div>
              <div>
                <p className="text-3xl font-display font-bold text-primary">+10k</p>
                <p className="text-xs text-gray-500 mt-1">عميل سعيد</p>
              </div>
              <div>
                <p className="text-3xl font-display font-bold text-primary">100%</p>
                <p className="text-xs text-gray-500 mt-1">جودة مضمونة</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
