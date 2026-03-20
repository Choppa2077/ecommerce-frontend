export interface Product {
  id: number;
  name: string;
  description: string;
  category_id: number;
  price: number;
  stock: number;
  image_url: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
  category_name: string;
}

export interface ProductListResponse {
  products: Product[];
  total: number;
  total_pages: number;
  page: number;
  limit: number;
}

export interface ProductStatistics {
  product_id: number;
  product_name: string;
  view_count: number;
  like_count: number;
  purchase_count: number;
  average_rating: number;
  review_count: number;
}

export interface ProductListParams {
  page?: number;
  limit?: number;
  category_id?: number;
  min_price?: number;
  max_price?: number;
  search?: string;
  sort_by?: 'name' | 'price' | 'created_at';
  sort_order?: 'asc' | 'desc';
}

export interface PurchasePayload {
  quantity: number;
}

export interface PurchasedResponse {
  purchased: boolean;
}

export interface LikedResponse {
  liked: boolean;
}


export interface InteractionResponse {
    message: string
}