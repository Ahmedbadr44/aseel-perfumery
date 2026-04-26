import { NextRequest, NextResponse } from "next/server";
import { FieldValue } from "firebase-admin/firestore";
import { getAdminAuth, getAdminDb } from "@/lib/firebase-admin";

type OrderStatus = "pending" | "completed" | "cancelled";
type PaymentMethod = "cash" | "vodafone_insta";

type CreateOrderBody = {
  customer_name: string;
  phone: string;
  governorate: string;
  city: string;
  address: string;
  payment_method: PaymentMethod;
  idempotency_key?: string;
  items: Array<{ id: string; quantity: number; size: string }>;
  governorate_id?: string;
};

const PHONE_REGEX = /^01[0125][0-9]{8}$/;

async function getAdminToken(req: NextRequest) {
  const adminAuth = getAdminAuth();
  const adminDb = getAdminDb();
  const authHeader = req.headers.get("authorization");
  if (!authHeader?.startsWith("Bearer ")) {
    return null;
  }
  const token = authHeader.replace("Bearer ", "").trim();
  if (!token) return null;

  const decoded = await adminAuth.verifyIdToken(token);
  const userDoc = await adminDb.collection("users").doc(decoded.uid).get();
  const profile = userDoc.data() as { is_admin?: boolean } | undefined;
  if (!decoded.admin && !profile?.is_admin) return null;

  return decoded;
}

function sanitizeArabicText(value: string, minLength: number) {
  const normalized = value.trim();
  if (normalized.length < minLength) return null;
  return normalized;
}

export async function POST(req: NextRequest) {
  try {
    const adminDb = getAdminDb();
    const body = (await req.json()) as CreateOrderBody;

    const customerName = sanitizeArabicText(body.customer_name || "", 3);
    const governorate = sanitizeArabicText(body.governorate || "", 1);
    const governorateId = body.governorate_id || "beheira";
    const city = sanitizeArabicText(body.city || "", 1);
    const address = sanitizeArabicText(body.address || "", 10);
    const paymentMethod = body.payment_method;
    const idempotencyKey = body.idempotency_key?.trim();

    if (!customerName || !governorate || !city || !address) {
      return NextResponse.json({ error: "بيانات الطلب غير مكتملة" }, { status: 400 });
    }

    if (!PHONE_REGEX.test((body.phone || "").trim())) {
      return NextResponse.json({ error: "رقم الهاتف غير صحيح" }, { status: 400 });
    }

    if (!["cash", "vodafone_insta"].includes(paymentMethod)) {
      return NextResponse.json({ error: "طريقة الدفع غير مدعومة" }, { status: 400 });
    }

    if (!Array.isArray(body.items) || body.items.length === 0) {
      return NextResponse.json({ error: "سلة الطلب فارغة" }, { status: 400 });
    }

    if (idempotencyKey) {
      const idemSnapshot = await adminDb
        .collection("orders")
        .where("idempotency_key", "==", idempotencyKey)
        .limit(1)
        .get();
      if (!idemSnapshot.empty) {
        return NextResponse.json({ orderId: idemSnapshot.docs[0].id, reused: true });
      }
    }

    const normalizedItems = body.items
      .filter((item) => item?.id && Number(item.quantity) > 0)
      .map((item) => ({ id: item.id, quantity: Number(item.quantity), size: item.size || '50ml' }));

    if (!normalizedItems.length) {
      return NextResponse.json({ error: "عناصر الطلب غير صالحة" }, { status: 400 });
    }

    const productDocs = await Promise.all(
      normalizedItems.map((item) => adminDb.collection("products").doc(item.id).get()),
    );

    const pricedItems = normalizedItems.map((item, index) => {
      const doc = productDocs[index];
      if (!doc.exists) {
        throw new Error("PRODUCT_NOT_FOUND");
      }
      const product = doc.data() as { name?: string; price?: number; image?: string; prices?: { '30ml'?: number, '50ml'?: number, '100ml'?: number } };
      if (typeof product.price !== "number" || !product.name) {
        throw new Error("INVALID_PRODUCT_DATA");
      }
      const itemPrice = product.prices?.[item.size as '30ml' | '50ml' | '100ml'] ?? product.price;

      return {
        id: item.id,
        name: product.name,
        image: product.image || "",
        price: itemPrice,
        size: item.size,
        quantity: item.quantity,
      };
    });

    const subtotal = pricedItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
    
    // Calculate shipping cost based on governorate_id
    const SHIPPING_RATES: Record<string, number> = {
      beheira: 0, alexandria: 70, kafr_el_sheikh: 70, gharbia: 70,
      monufia: 70, dakahlia: 70, cairo: 70, giza: 70, qalyubia: 70,
      sharqia: 70, damietta: 70, matrouh: 100, fayoum: 100, ismailia: 100,
      minya: 100, new_valley: 100, suez: 100, port_said: 100, south_sinai: 100,
      qena: 100, north_sinai: 100, sohag: 100, beni_suef: 100, luxor: 100,
      aswan: 100, asyut: 100, red_sea: 100
    };
    let shipping_cost = 100;
    if (governorateId) {
      if (governorateId === 'beheira' && body.city === 'النوبارية') {
        shipping_cost = 0;
      } else {
        shipping_cost = SHIPPING_RATES[governorateId] ?? 100;
      }
    }
    const total = subtotal + shipping_cost;

    const orderRef = await adminDb.collection("orders").add({
      customer_name: customerName,
      phone: body.phone.trim(),
      governorate,
      governorate_id: governorateId,
      city,
      address,
      items: pricedItems,
      subtotal,
      shipping_cost,
      total,
      payment_method: paymentMethod,
      status: "pending",
      status_history: [{ status: "pending", at: new Date().toISOString() }],
      idempotency_key: idempotencyKey || null,
      created_at: FieldValue.serverTimestamp(),
      updated_at: FieldValue.serverTimestamp(),
    });

    return NextResponse.json({ orderId: orderRef.id, total, subtotal, shipping_cost, reused: false }, { status: 201 });
  } catch (error) {
    console.error("❌ Order API POST Error:", error);
    const message = error instanceof Error ? error.message : "UNKNOWN_ERROR";
    if (message === "PRODUCT_NOT_FOUND") {
      return NextResponse.json({ error: "أحد المنتجات غير متوفر" }, { status: 400 });
    }
    if (message === "INVALID_PRODUCT_DATA") {
      return NextResponse.json({ error: "بيانات المنتج غير صالحة" }, { status: 500 });
    }
    return NextResponse.json({ error: "تعذر إنشاء الطلب حالياً" }, { status: 500 });
  }
}

export async function GET(req: NextRequest) {
  try {
    const adminDb = getAdminDb();
    const admin = await getAdminToken(req);
    if (!admin) {
      return NextResponse.json({ error: "غير مصرح" }, { status: 401 });
    }

    const snapshot = await adminDb.collection("orders").orderBy("created_at", "desc").get();
    const orders = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
    return NextResponse.json({ orders });
  } catch (error) {
    console.error("❌ Order API GET Error:", error);
    return NextResponse.json({ error: "تعذر تحميل الطلبات" }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const adminDb = getAdminDb();
    const admin = await getAdminToken(req);
    if (!admin) {
      return NextResponse.json({ error: "غير مصرح" }, { status: 401 });
    }

    const body = (await req.json()) as { orderId?: string; status?: OrderStatus };
    if (!body.orderId || !body.status) {
      return NextResponse.json({ error: "بيانات غير مكتملة" }, { status: 400 });
    }
    if (!["pending", "completed", "cancelled"].includes(body.status)) {
      return NextResponse.json({ error: "حالة غير صالحة" }, { status: 400 });
    }

    const orderRef = adminDb.collection("orders").doc(body.orderId);
    const orderSnap = await orderRef.get();
    if (!orderSnap.exists) {
      return NextResponse.json({ error: "الطلب غير موجود" }, { status: 404 });
    }

    const order = orderSnap.data() as { status?: OrderStatus; status_history?: unknown[] };
    const currentStatus = order.status || "pending";
    if (currentStatus === body.status) {
      return NextResponse.json({ success: true });
    }
    if (currentStatus !== "pending") {
      return NextResponse.json(
        { error: "لا يمكن تغيير حالة الطلب بعد إغلاقه" },
        { status: 400 },
      );
    }

    await orderRef.update({
      status: body.status,
      updated_at: FieldValue.serverTimestamp(),
      status_history: [
        ...(Array.isArray(order.status_history) ? order.status_history : []),
        { status: body.status, at: new Date().toISOString(), by: admin.uid },
      ],
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("❌ Order API PATCH Error:", error);
    return NextResponse.json({ error: "تعذر تحديث حالة الطلب" }, { status: 500 });
  }
}
