export interface UserProfile {
  address: string;
  city: string;
  country: string;
  created_at: string;
  date_of_birth: string;
  email: string;
  first_name: string;
  gender: string;
  id: number;
  last_name: string;
  middle_name: string;
  phone: string;
  postal_code: string;
  status: string;
  updated_at: string;
  user_id: number;
}
export interface UpdateProfilePayload {
  address?: string;
  city?: string;
  country?: string;
  date_of_birth?: string;
  first_name?: string;
  gender?: string;
  last_name?: string;
  middle_name?: string;
  phone?: string;
  postal_code?: string;
}

export interface ChangePasswordPayload {
  confirm_password: string;
  current_password:
   string;
  new_password: string;
}
export interface Recommendation {
  product_id: number;
  product_name: string;
  category_id: number;
  price: number;
  score: number;
  reason: string;
}

export interface RecommendationResponse {
  user_id: number;
  recommendations: Recommendation[];
  algorithm: string;
  generated_at: string;
}

export interface UserInteraction {
  id: string;
  user_id: number;
  product_id: number;
  product: {
    id: number;
    name: string;
    price: number;
    image_url: string;
  };
  interaction_type: 'view' | 'like' | 'purchase';
  quantity?: number;
  created_at: string;
}


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