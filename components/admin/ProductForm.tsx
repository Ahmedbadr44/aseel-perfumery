"use client";

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Product } from "@/lib/services/firebase-db";
import { productsService } from "@/lib/services/firebase-db";
import { Upload, X, Plus, Image as ImageIcon, Loader2 } from "lucide-react";
import Image from "next/image";

const productSchema = z.object({
  name: z.string().min(3, "الاسم مطلوب"),
  price: z.number().min(1, "السعر مطلوب"),
  description: z.string().min(10, "الوصف مطلوب"),
  gender: z.enum(["men", "women", "unisex"]),
  category: z.string().min(2, "الفئة مطلوبة"),
  image: z.string().min(1, "صورة المنتج مطلوبة"),
  inspired_by_name: z.string().optional(),
  inspired_by_image: z.string().optional(),
  is_best_seller: z.boolean().default(false),
  is_trending_now: z.boolean().default(false),
  selling_points: z.object({
    longevity: z.string().optional(),
    sillage: z.string().optional(),
    occasion: z.string().optional(),
  }).optional(),
  prices: z.object({
    "30ml": z.number().min(1, "السعر مطلوب").optional(),
    "50ml": z.number().min(1, "السعر مطلوب").optional(),
    "100ml": z.number().min(1, "السعر مطلوب").optional(),
  }).optional(),
});

type ProductFormData = z.input<typeof productSchema>;

interface ProductFormProps {
  product?: Product | null;
  onSuccess: () => void;
  onCancel: () => void;
}

export const ProductForm: React.FC<ProductFormProps> = ({
  product,
  onSuccess,
  onCancel,
}) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [uploadingField, setUploadingField] = useState<string | null>(null);

  const [notes, setNotes] = useState({
    top: product?.notes?.top || [""],
    middle: product?.notes?.middle || [""],
    base: product?.notes?.base || [""],
  });

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<ProductFormData>({
    resolver: zodResolver(productSchema),
    defaultValues: product
      ? {
          name: product.name,
          price: product.price,
          description: product.description,
          gender: product.gender,
          category: product.category,
          image: product.image,
          inspired_by_name: product.inspired_by_name || "",
          inspired_by_image: product.inspired_by_image || "",
          is_best_seller: product.is_best_seller || false,
          is_trending_now: product.is_trending_now || false,
          selling_points: {
            longevity: product.selling_points?.longevity || "",
            sillage: product.selling_points?.sillage || "",
            occasion: product.selling_points?.occasion || "",
          },
          prices: product.prices || {},
        }
      : {
          gender: "unisex",
          is_best_seller: false,
          is_trending_now: false,
          image: "",
          inspired_by_image: "",
          selling_points: {
            longevity: "",
            sillage: "",
            occasion: "",
          },
          prices: {},
        },
  });

  const currentImage = watch("image");
  const currentInspiredImage = watch("inspired_by_image");

  const authenticator = async () => {
    try {
      const response = await fetch("/api/imagekit/auth");
      if (!response.ok) {
        throw new Error(`Request failed with status ${response.status}`);
      }
      const data = await response.json();
      const { signature, expire, token } = data;
      return { signature, expire, token };
    } catch (error) {
      throw new Error(`Authentication request failed: ${error instanceof Error ? error.message : String(error)}`);
    }
  };

  const handleUploadSuccess = (res: any, field: "image" | "inspired_by_image") => {
    setValue(field, res.url);
    setUploadingField(null);
  };

  const handleUploadError = (err: any) => {
    console.error("Error uploading image:", err);
    alert("حدث خطأ أثناء رفع الصورة");
    setUploadingField(null);
  };

  const handleUploadStart = (field: "image" | "inspired_by_image") => {
    setUploadingField(field);
  };

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>, field: "image" | "inspired_by_image") => {
    const file = e.target.files?.[0];
    if (!file) return;

    handleUploadStart(field);

    try {
      const auth = await authenticator();
      const formData = new FormData();
      formData.append("file", file);
      formData.append("publicKey", process.env.NEXT_PUBLIC_IMAGEKIT_PUBLIC_KEY || "");
      formData.append("signature", auth.signature);
      formData.append("expire", auth.expire.toString());
      formData.append("token", auth.token);
      formData.append("fileName", file.name);
      formData.append("folder", field === "image" ? "/aseel-products" : "/aseel-brands");

      const response = await fetch("https://upload.imagekit.io/api/v1/files/upload", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Upload failed");
      }

      const data = await response.json();
      handleUploadSuccess(data, field);
    } catch (error) {
      handleUploadError(error);
    }
  };

  const handleNoteChange = (
    type: "top" | "middle" | "base",
    index: number,
    value: string,
  ) => {
    const newNotes = { ...notes };
    newNotes[type][index] = value;
    setNotes(newNotes);
  };

  const addNoteField = (type: "top" | "middle" | "base") => {
    setNotes({ ...notes, [type]: [...notes[type], ""] });
  };

  const removeNoteField = (type: "top" | "middle" | "base", index: number) => {
    const newNotes = { ...notes };
    newNotes[type].splice(index, 1);
    setNotes(newNotes);
  };

  const onSubmit = async (data: ProductFormData) => {
    setIsSubmitting(true);
    try {
      const productData = {
        ...data,
        notes: {
          top: notes.top.filter((n) => n.trim() !== ""),
          middle: notes.middle.filter((n) => n.trim() !== ""),
          base: notes.base.filter((n) => n.trim() !== ""),
        },
        is_best_seller: data.is_best_seller ?? false,
        is_trending_now: data.is_trending_now ?? false,
        selling_points: {
          longevity: data.selling_points?.longevity?.trim() || "",
          sillage: data.selling_points?.sillage?.trim() || "",
          occasion: data.selling_points?.occasion?.trim() || "",
        },
        prices: data.prices,
      };

      if (product) {
        await productsService.update(product.id, productData);
      } else {
        await productsService.create(productData);
      }
      onSuccess();
    } catch (error) {
      console.error("Error saving product:", error);
      alert("حدث خطأ أثناء حفظ المنتج.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-8 pb-12">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <label className="text-sm font-bold text-gray-700">اسم المنتج</label>
          <input
            {...register("name")}
            className="w-full px-4 py-3 rounded-xl border border-gray-200 outline-none focus:border-secondary transition-all"
            placeholder="مثال: أصيل رويال عود"
          />
          {errors.name && (
            <p className="text-red-500 text-xs">{errors.name.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <label className="text-sm font-bold text-gray-700">
            السعر الأساسي (جنيه)
          </label>
          <input
            type="number"
            {...register("price", { valueAsNumber: true })}
            className="w-full px-4 py-3 rounded-xl border border-gray-200 outline-none focus:border-secondary transition-all"
            placeholder="750"
          />
          {errors.price && (
            <p className="text-red-500 text-xs">{errors.price.message}</p>
          )}
        </div>
      </div>

      <div className="p-6 bg-gray-50 rounded-3xl space-y-6">
        <h4 className="font-display font-bold text-primary flex items-center gap-2">
          الأسعار حسب الحجم
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="space-y-2">
            <label className="text-sm font-bold text-gray-700">سعر 30ml</label>
            <input
              type="number"
              {...register("prices.30ml", { valueAsNumber: true })}
              className="w-full px-4 py-3 rounded-xl border border-white outline-none focus:border-secondary transition-all bg-white"
              placeholder="150"
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-bold text-gray-700">سعر 50ml</label>
            <input
              type="number"
              {...register("prices.50ml", { valueAsNumber: true })}
              className="w-full px-4 py-3 rounded-xl border border-white outline-none focus:border-secondary transition-all bg-white"
              placeholder="250"
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-bold text-gray-700">سعر 100ml</label>
            <input
              type="number"
              {...register("prices.100ml", { valueAsNumber: true })}
              className="w-full px-4 py-3 rounded-xl border border-white outline-none focus:border-secondary transition-all bg-white"
              placeholder="500"
            />
          </div>
        </div>
      </div>

      <div className="space-y-2">
        <label className="text-sm font-bold text-gray-700">الوصف</label>
        <textarea
          {...register("description")}
          rows={3}
          className="w-full px-4 py-3 rounded-xl border border-gray-200 outline-none focus:border-secondary transition-all resize-none"
          placeholder="اكتب وصفاً جذاباً للمنتج..."
        />
        {errors.description && (
          <p className="text-red-500 text-xs">{errors.description.message}</p>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <label className="text-sm font-bold text-gray-700">النوع</label>
          <select
            {...register("gender")}
            className="w-full px-4 py-3 rounded-xl border border-gray-200 outline-none focus:border-secondary transition-all"
          >
            <option value="men">رجالي</option>
            <option value="women">نسائي</option>
            <option value="unisex">للجنسين</option>
          </select>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-bold text-gray-700">الفئة</label>
          <input
            {...register("category")}
            className="w-full px-4 py-3 rounded-xl border border-gray-200 outline-none focus:border-secondary transition-all"
            placeholder="مثال: شرقي، خشبي"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            {...register("is_best_seller")}
            id="is_best_seller"
            className="w-5 h-5 accent-secondary"
          />
          <label
            htmlFor="is_best_seller"
            className="text-sm font-bold text-gray-700"
          >
            الأكثر مبيعاً
          </label>
        </div>

        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            {...register("is_trending_now")}
            id="is_trending_now"
            className="w-5 h-5 accent-secondary"
          />
          <label
            htmlFor="is_trending_now"
            className="text-sm font-bold text-gray-700"
          >
            رائج حالياً
          </label>
        </div>
      </div>

      <div className="p-6 bg-gray-50 rounded-3xl space-y-6">
        <h4 className="font-display font-bold text-primary">
          تفاصيل العرض في صفحة المنتج
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="space-y-2">
            <label className="text-sm font-bold text-gray-700">الثبات</label>
            <input
              {...register("selling_points.longevity")}
              className="w-full px-4 py-3 rounded-xl border border-white outline-none focus:border-secondary transition-all bg-white"
              placeholder="مثال: ثبات جيد للاستخدام اليومي"
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-bold text-gray-700">الفوحان</label>
            <input
              {...register("selling_points.sillage")}
              className="w-full px-4 py-3 rounded-xl border border-white outline-none focus:border-secondary transition-all bg-white"
              placeholder="مثال: فوحان متوازن غير مزعج"
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-bold text-gray-700">أنسب وقت للاستخدام</label>
            <input
              {...register("selling_points.occasion")}
              className="w-full px-4 py-3 rounded-xl border border-white outline-none focus:border-secondary transition-all bg-white"
              placeholder="مثال: مناسب لليوم والمساء"
            />
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <label className="text-sm font-bold text-gray-700">صورة العطر</label>
        <div className="flex items-center gap-6">
          <div className="relative w-32 h-40 bg-gray-50 rounded-2xl border-2 border-dashed border-gray-200 flex items-center justify-center overflow-hidden">
            {currentImage ? (
              <Image
                src={currentImage}
                alt="Preview"
                fill
                className="object-cover"
              />
            ) : (
              <ImageIcon className="text-gray-300" size={32} />
            )}
            {uploadingField === "image" && (
              <div className="absolute inset-0 bg-white/80 flex items-center justify-center">
                <Loader2 className="animate-spin text-secondary" />
              </div>
            )}
          </div>
          <div className="space-y-2">
            <label className="cursor-pointer bg-white border border-gray-300 px-4 py-2 rounded-lg text-sm font-bold hover:bg-gray-50 transition-all inline-block">
              <span className="flex items-center gap-2">
                {uploadingField === "image" ? <Loader2 size={16} className="animate-spin" /> : <Upload size={16} />}
                {(currentImage && !currentImage.includes("placeholder")) ? "تغيير الصورة" : "رفع صورة المنتج"}
              </span>
              <input
                type="file"
                className="hidden"
                accept="image/*"
                onChange={(e) => handleUpload(e, "image")}
              />
            </label>
            <p className="text-xs text-gray-400">يفضل صورة بخلفية شفافة أو بيضاء (JPG, PNG)</p>
          </div>
        </div>
        {errors.image && (
          <p className="text-red-500 text-xs">{errors.image.message}</p>
        )}
      </div>

      <div className="p-6 bg-gray-50 rounded-3xl space-y-6">
        <h4 className="font-display font-bold text-primary flex items-center gap-2">
          <Plus size={18} />
          معلومات العطر الأصلي (المستوحى منه)
        </h4>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-bold text-gray-700">اسم الماركة الأصلية</label>
              <input
                {...register("inspired_by_name")}
                className="w-full px-4 py-3 rounded-xl border border-white outline-none focus:border-secondary transition-all bg-white"
                placeholder="مثال: Sauvage - Dior"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-bold text-gray-700">صورة الماركة</label>
              <label className="cursor-pointer bg-white border border-gray-200 w-full p-4 rounded-xl flex items-center justify-center gap-2 text-gray-500 hover:bg-gray-50 transition-all border-dashed border-2">
                {uploadingField === "inspired_by_image" ? <Loader2 size={18} className="animate-spin" /> : <Upload size={18} />}
                <span className="text-sm font-bold">
                  {uploadingField === "inspired_by_image" ? "جاري الرفع..." : (currentInspiredImage && !currentInspiredImage.includes("placeholder")) ? "تم الرفع - تغيير؟" : "اضغط لرفع صورة الماركة"}
                </span>
                <input
                  type="file"
                  className="hidden"
                  accept="image/*"
                  onChange={(e) => handleUpload(e, "inspired_by_image")}
                />
              </label>
            </div>
          </div>

          <div className="flex items-center justify-center">
            <div className="relative w-32 h-32 bg-white rounded-2xl shadow-sm border border-gray-100 flex items-center justify-center overflow-hidden">
              {currentInspiredImage ? (
                <Image
                  src={currentInspiredImage}
                  alt="Inspired Preview"
                  fill
                  className="object-contain p-2"
                />
              ) : (
                <ImageIcon className="text-gray-100" size={48} />
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="space-y-6 pt-4">
        <h4 className="font-display font-bold text-primary border-r-4 border-secondary pr-4">
          مكونات العطر (النوتات)
        </h4>

        {(["top", "middle", "base"] as const).map((type) => (
          <div key={type} className="space-y-3">
            <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">
              {type === "top"
                ? "إفتتاحية العطر"
                : type === "middle"
                  ? "قلب العطر"
                  : "قاعدة العطر"}
            </label>
            <div className="flex flex-wrap gap-3">
              {notes[type].map((note, index) => (
                <div key={index} className="flex items-center gap-2 group">
                  <input
                    value={note}
                    onChange={(e) =>
                      handleNoteChange(type, index, e.target.value)
                    }
                    className="px-4 py-2 rounded-xl border border-gray-200 text-sm outline-none focus:border-secondary bg-white min-w-[120px]"
                    placeholder="زعفران، ليمون..."
                  />
                  <button
                    type="button"
                    onClick={() => removeNoteField(type, index)}
                    className="text-gray-300 hover:text-red-500 transition-colors"
                  >
                    <X size={16} />
                  </button>
                </div>
              ))}
              <button
                type="button"
                onClick={() => addNoteField(type)}
                className="w-10 h-10 rounded-xl bg-gray-100 text-gray-400 hover:bg-secondary hover:text-white transition-all flex items-center justify-center"
              >
                <Plus size={20} />
              </button>
            </div>
          </div>
        ))}
      </div>

      <div className="flex justify-end gap-4 pt-8 border-t sticky bottom-0 bg-white/95 backdrop-blur-sm z-10 pb-4">
        <button
          type="button"
          onClick={onCancel}
          className="px-8 py-3 rounded-full border border-gray-200 font-bold hover:bg-gray-50 transition-all text-gray-500"
        >
          إلغاء
        </button>
        <button
          type="submit"
          disabled={isSubmitting || uploadingField !== null}
          className="px-12 py-3 rounded-full bg-primary text-white font-bold hover:bg-primary/90 transition-all shadow-xl disabled:opacity-50 min-w-[180px]"
        >
          {isSubmitting ? <Loader2 className="animate-spin mx-auto" /> : "حفظ المنتج"}
        </button>
      </div>
    </form>
  );
};
