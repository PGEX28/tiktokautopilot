export interface DbUser {
  id: string;
  email: string;
  name?: string;
  role: 'ADMIN' | 'USER' | 'OPERATOR';
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface DbTikTokAccount {
  id: string;
  user_id?: string;
  seller_name?: string;
  open_id: string;
  shop_id?: string;
  shop_cipher?: string;
  encrypted_access_token: string;
  encrypted_refresh_token?: string;
  token_iv: string;
  token_tag: string;
  token_expires_at: string;
  refresh_token_expires_at?: string;
  scopes: string[];
  status: 'CONNECTED' | 'EXPIRED' | 'DISCONNECTED' | 'REVOKED';
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface DbProduct {
  id: string;
  external_id?: string;
  title: string;
  description?: string;
  category: string;
  subcategory?: string;
  price: number;
  currency: string;
  original_price?: number;
  discount_percentage?: number;
  main_image_url: string;
  additional_images?: string[];
  product_url?: string;
  problem_solved?: string;
  target_audience?: string;
  visual_hook_potential: 'LOW' | 'MEDIUM' | 'HIGH' | 'VIRAL';
  has_affiliate_available: boolean;
  status: 'DISCOVERED' | 'SCORED' | 'APPROVED' | 'REJECTED' | 'IN_PRODUCTION' | 'ARCHIVED';
  created_at: string;
  updated_at: string;
}

export interface DbProductScore {
  id: string;
  product_id: string;
  total_score: number;
  tier: 'EXCELENTE' | 'FORTE' | 'TESTAR' | 'FRACO' | 'DESCARTAR';
  weights: Record<string, number>;
  breakdown: Record<string, unknown>;
  pros: string[];
  cons: string[];
  risks: string[];
  explanation: string;
  recommended_action: 'PROCEED_AUTOPILOT' | 'MANUAL_REVIEW' | 'DISCARD';
  disclaimer: string;
  scored_at: string;
  created_at: string;
  updated_at: string;
}

export interface DbScript {
  id: string;
  project_id?: string;
  product_id: string;
  variation_name: string;
  style: string;
  hook_text: string;
  sections: Record<string, unknown>[];
  total_duration_seconds: number;
  caption: string;
  hashtags: string[];
  cta_text: string;
  provider: string;
  model: string;
  cost_usd: number;
  created_at: string;
  updated_at: string;
}

export interface DbVideoVariation {
  id: string;
  project_id?: string;
  product_id: string;
  script_id?: string;
  variation_name: string;
  angle_strategy: string;
  resolution: string;
  aspect_ratio: string;
  duration_seconds: number;
  video_url: string;
  thumbnail_url?: string;
  provider: string;
  cost_usd: number;
  status: 'PENDING' | 'RENDERING' | 'COMPLETED' | 'FAILED';
  created_at: string;
  updated_at: string;
}

export interface DbLiveLoop {
  id: string;
  product_id: string;
  title: string;
  variation_ids_order: string[];
  transition_type: string;
  transition_duration_seconds: number;
  product_card_overlay: boolean;
  cta_text_overlay?: string;
  final_video_url?: string;
  duration_seconds?: number;
  status: 'READY' | 'GENERATING' | 'FAILED';
  instructions_for_live_host: string;
  created_at: string;
  updated_at: string;
}

export interface DbMetric {
  id: string;
  video_id?: string;
  video_variation_id?: string;
  product_id: string;
  views: number;
  impressions: number;
  watch_time_seconds: number;
  average_watch_duration: number;
  completion_rate: number;
  clicks: number;
  ctr: number;
  product_views: number;
  add_to_cart: number;
  orders: number;
  cvr: number;
  gmv: number;
  commission: number;
  epc: number;
  rpm: number;
  period_start: string;
  period_end: string;
  recorded_at: string;
  created_at: string;
  updated_at: string;
}

export interface DbSetting {
  id: string;
  key: string;
  value: Record<string, unknown>;
  description?: string;
  created_at: string;
  updated_at: string;
}
