"use client";

import { useRouter } from "next/navigation";

export default function MakeAdminPage() {
  const router = useRouter();

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="bg-white p-8 rounded-2xl shadow-xl text-center">
        <h1 className="text-2xl font-bold text-primary mb-4">تم تعطيل هذه الصفحة</h1>
        <p className="text-lg text-gray-600">
          لأسباب أمنية، لا يمكن منح صلاحيات المدير من واجهة العميل.
        </p>
        <button
          onClick={() => router.push("/admin/dashboard")}
          className="mt-4 px-6 py-2 bg-primary text-white rounded-lg"
        >
          الذهاب للوحة التحكم
        </button>
      </div>
    </div>
  );
}
