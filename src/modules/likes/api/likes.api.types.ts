
export interface Like {
  product_id: number;
  product_name: string;
  category_id: number;
  price: number;
  interacted_at: string;
}

export interface LikesResponse {
  count: number;
  likes: Like[];
}