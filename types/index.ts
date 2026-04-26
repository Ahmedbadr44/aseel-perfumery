export interface Product {
  id: string;
  name: string;
  price: number;
  description: string;
  gender: 'men' | 'women' | 'unisex';
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
  created_at?: Date | string;
}

export interface CartItem extends Product {
  quantity: number;
}

export interface Order {
  id: string;
  customer_name: string;
  phone: string;
  address: string;
  governorate?: string;
  city?: string;
  items: CartItem[];
  total: number;
  payment_method: 'cash' | 'vodafone_insta' | 'card';
  status: 'pending' | 'completed' | 'cancelled';
  created_at: Date | string;
}
