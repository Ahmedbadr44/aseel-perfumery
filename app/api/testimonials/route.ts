import { NextRequest, NextResponse } from "next/server";
import { FieldValue } from "firebase-admin/firestore";
import { getAdminAuth, getAdminDb } from "@/lib/firebase-admin";

function sanitizeComment(value: string) {
  const normalized = value.trim().replace(/\s+/g, " ");
  if (normalized.length < 10 || normalized.length > 500) {
    return null;
  }
  return normalized;
}

async function getSignedInUser(req: NextRequest) {
  const authHeader = req.headers.get("authorization");
  if (!authHeader?.startsWith("Bearer ")) {
    return null;
  }

  const token = authHeader.replace("Bearer ", "").trim();
  if (!token) {
    return null;
  }

  return getAdminAuth().verifyIdToken(token);
}

function getCreatedAtValue(value: any) {
  if (!value) return 0;
  if (typeof value?.toMillis === "function") return value.toMillis();
  if (typeof value === "string") return new Date(value).getTime();
  return 0;
}

export async function GET(req: NextRequest) {
  try {
    const adminDb = getAdminDb();
    const { searchParams } = new URL(req.url);
    const productId = searchParams.get("productId");
    const limit = Math.min(Number(searchParams.get("limit") || "6"), 12);

    const collection = adminDb.collection("testimonials");
    const snapshot = productId
      ? await collection.where("product_id", "==", productId).get()
      : await collection.orderBy("created_at", "desc").limit(limit).get();

    const testimonials = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    const orderedTestimonials = productId
      ? testimonials
          .sort((a: any, b: any) => getCreatedAtValue(b.created_at) - getCreatedAtValue(a.created_at))
          .slice(0, limit)
      : testimonials;

    const summary = orderedTestimonials.length
      ? {
          count: orderedTestimonials.length,
          average:
            orderedTestimonials.reduce((sum, item: any) => sum + Number(item.rating || 0), 0) / orderedTestimonials.length,
        }
      : { count: 0, average: 0 };

    return NextResponse.json({ testimonials: orderedTestimonials, summary });
  } catch (error) {
    console.error("Testimonials GET error:", error);
    return NextResponse.json({ error: "تعذر تحميل التقييمات" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const adminDb = getAdminDb();
    const user = await getSignedInUser(req);
    if (!user) {
      return NextResponse.json({ error: "يجب تسجيل الدخول أولًا" }, { status: 401 });
    }

    const body = (await req.json()) as {
      productId?: string;
      productName?: string;
      rating?: number;
      comment?: string;
    };

    const productId = body.productId?.trim();
    const productName = body.productName?.trim();
    const rating = Number(body.rating);
    const comment = sanitizeComment(body.comment || "");

    if (!productId || !productName || !comment || rating < 1 || rating > 5) {
      return NextResponse.json({ error: "بيانات التقييم غير مكتملة" }, { status: 400 });
    }

    const existingForProduct = await adminDb
      .collection("testimonials")
      .where("product_id", "==", productId)
      .get();

    if (existingForProduct.docs.some((doc) => doc.data().user_id === user.uid)) {
      return NextResponse.json({ error: "لقد قمت بإرسال تقييم لهذا المنتج من قبل" }, { status: 409 });
    }

    const userDoc = await adminDb.collection("users").doc(user.uid).get();
    const userProfile = userDoc.data() as { display_name?: string } | undefined;
    const userName = userProfile?.display_name || user.name || user.email || "عميل أصيل";

    const testimonialRef = await adminDb.collection("testimonials").add({
      product_id: productId,
      product_name: productName,
      user_id: user.uid,
      user_name: userName,
      user_email: user.email || null,
      rating,
      comment,
      created_at: FieldValue.serverTimestamp(),
    });

    return NextResponse.json({ id: testimonialRef.id }, { status: 201 });
  } catch (error) {
    console.error("Testimonials POST error:", error);
    return NextResponse.json({ error: "تعذر إرسال التقييم حاليًا" }, { status: 500 });
  }
}
