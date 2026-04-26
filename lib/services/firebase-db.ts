import { 
  collection, 
  doc, 
  getDoc, 
  getDocs, 
  addDoc, 
  updateDoc, 
  deleteDoc,
  query, 
  where, 
  serverTimestamp,
  Timestamp,
  Firestore
} from "firebase/firestore";

export interface Product {
  id: string;
  name: string;
  price: number;
  description: string;
  gender: "men" | "women" | "unisex";
  category: string;
  image: string;
  notes?: {
    top: string[];
    middle: string[];
    base: string[];
  };
  inspired_by_name?: string;
  inspired_by_image?: string;
  is_best_seller: boolean;
  is_trending_now?: boolean;
  selling_points?: {
    longevity?: string;
    sillage?: string;
    occasion?: string;
  };
  prices?: {
    "30ml"?: number;
    "50ml"?: number;
    "100ml"?: number;
  };
  created_at: Timestamp | Date;
}

export interface Order {
  id: string;
  customer_name: string;
  phone: string;
  governorate: string;
  city: string;
  address: string;
  items: Array<{
    id: string;
    name: string;
    price: number;
    quantity: number;
    image?: string;
  }>;
  total: number;
  payment_method: "cash" | "vodafone_insta" | "card";
  status: "pending" | "completed" | "cancelled";
  created_at: Timestamp | Date;
}

export interface UserProfile {
  id: string;
  email: string;
  display_name: string;
  is_admin: boolean;
  created_at: Timestamp | Date;
}

function getDb(): Firestore {
  const { db } = require("@/lib/firebase");
  return db;
}

function getCollection(name: string) {
  return collection(getDb(), name);
}

export const productsService = {
  async getAll(): Promise<Product[]> {
    const snapshot = await getDocs(getCollection("products"));
    return snapshot.docs.map((doc: any) => ({ id: doc.id, ...doc.data() } as Product));
  },

  async getById(id: string): Promise<Product | null> {
    const snapshot = await getDoc(doc(getDb(), "products", id));
    if (!snapshot.exists()) return null;
    return { id: snapshot.id, ...snapshot.data() } as Product;
  },

  async getByGender(gender: string): Promise<Product[]> {
    const q = query(getCollection("products"), where("gender", "==", gender));
    const snapshot = await getDocs(q);
    return snapshot.docs.map((doc: any) => ({ id: doc.id, ...doc.data() } as Product));
  },

  async getBestSellers(): Promise<Product[]> {
    const q = query(getCollection("products"), where("is_best_seller", "==", true));
    const snapshot = await getDocs(q);
    return snapshot.docs.map((doc: any) => ({ id: doc.id, ...doc.data() } as Product));
  },

  async getTrendingNow(): Promise<Product[]> {
    const q = query(getCollection("products"), where("is_trending_now", "==", true));
    const snapshot = await getDocs(q);
    return snapshot.docs.map((doc: any) => ({ id: doc.id, ...doc.data() } as Product));
  },

  async getByCategory(category: string): Promise<Product[]> {
    const q = query(getCollection("products"), where("category", "==", category));
    const snapshot = await getDocs(q);
    return snapshot.docs.map((doc: any) => ({ id: doc.id, ...doc.data() } as Product));
  },

  async create(product: Omit<Product, "id" | "created_at">): Promise<string> {
    const docRef = await addDoc(getCollection("products"), {
      ...product,
      created_at: serverTimestamp(),
    });
    return docRef.id;
  },

  async update(id: string, data: Partial<Product>): Promise<void> {
    const docRef = doc(getDb(), "products", id);
    await updateDoc(docRef, data);
  },

  async delete(id: string): Promise<void> {
    const docRef = doc(getDb(), "products", id);
    await deleteDoc(docRef);
  },
};

export const ordersService = {
  async getAll(): Promise<Order[]> {
    const snapshot = await getDocs(getCollection("orders"));
    return snapshot.docs.map((doc: any) => ({ id: doc.id, ...doc.data() } as Order));
  },

  async getByPhone(phone: string): Promise<Order[]> {
    const q = query(getCollection("orders"), where("phone", "==", phone));
    const snapshot = await getDocs(q);
    return snapshot.docs.map((doc: any) => ({ id: doc.id, ...doc.data() } as Order));
  },

  async create(order: Omit<Order, "id" | "created_at">): Promise<string> {
    const docRef = await addDoc(getCollection("orders"), {
      ...order,
      created_at: serverTimestamp(),
    });
    return docRef.id;
  },

  async updateStatus(id: string, status: Order["status"]): Promise<void> {
    const docRef = doc(getDb(), "orders", id);
    await updateDoc(docRef, { status });
  },

  async delete(id: string): Promise<void> {
    const docRef = doc(getDb(), "orders", id);
    await deleteDoc(docRef);
  },
};

export const usersService = {
  async getById(id: string): Promise<UserProfile | null> {
    const snapshot = await getDoc(doc(getDb(), "users", id));
    if (!snapshot.exists()) return null;
    return { id: snapshot.id, ...snapshot.data() } as UserProfile;
  },

  async create(user: Omit<UserProfile, "id" | "created_at">): Promise<string> {
    const docRef = await addDoc(getCollection("users"), {
      ...user,
      created_at: serverTimestamp(),
    });
    return docRef.id;
  },

  async update(id: string, data: Partial<UserProfile>): Promise<void> {
    const docRef = doc(getDb(), "users", id);
    await updateDoc(docRef, data);
  },

  async getAdmins(): Promise<UserProfile[]> {
    const q = query(getCollection("users"), where("is_admin", "==", true));
    const snapshot = await getDocs(q);
    return snapshot.docs.map((doc: any) => ({ id: doc.id, ...doc.data() } as UserProfile));
  },
};
