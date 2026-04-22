import { NextRequest, NextResponse } from "next/server";
import { getAdminDb } from "@/lib/firebase-admin";

const PHONE_REGEX = /^01[0125][0-9]{8}$/;

function maskAddress(address: string) {
  const normalized = address.trim();
  if (normalized.length <= 8) return "عنوان مسجل";
  return `${normalized.slice(0, 8)}...`;
}

export async function POST(req: NextRequest) {
  try {
    const adminDb = getAdminDb();
    const body = (await req.json()) as { phone?: string };
    const phone = (body.phone || "").trim();

    if (!PHONE_REGEX.test(phone)) {
      return NextResponse.json({ error: "رقم الهاتف غير صحيح" }, { status: 400 });
    }

    const snapshot = await adminDb
      .collection("orders")
      .where("phone", "==", phone)
      .orderBy("created_at", "desc")
      .limit(10)
      .get();

    const orders = snapshot.docs.map((doc) => {
      const data = doc.data() as {
        governorate?: string;
        city?: string;
        address?: string;
        total?: number;
        payment_method?: string;
        status?: string;
        created_at?: unknown;
        items?: Array<{ name?: string; image?: string; price?: number; quantity?: number }>;
      };

      return {
        id: doc.id,
        governorate: data.governorate || "",
        city: data.city || "",
        address: maskAddress(data.address || ""),
        total: Number(data.total || 0),
        payment_method: data.payment_method || "cash",
        status: data.status || "pending",
        created_at: data.created_at || null,
        items: Array.isArray(data.items)
          ? data.items.map((item) => ({
              name: item.name || "",
              image: item.image || "",
              price: Number(item.price || 0),
              quantity: Number(item.quantity || 0),
            }))
          : [],
      };
    });

    return NextResponse.json({ orders });
  } catch {
    return NextResponse.json({ error: "تعذر تحميل الطلبات" }, { status: 500 });
  }
}
