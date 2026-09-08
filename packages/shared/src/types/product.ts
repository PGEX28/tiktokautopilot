export type ProductStatus = 'DISCOVERED' | 'SCORED' | 'APPROVED' | 'REJECTED' | 'IN_PRODUCTION' | 'PUBLISHED' | 'ARCHIVED';

export type ProductSourceType = 'TIKTOK_SHOP_AFFILIATE' | 'TREND_FEED' | 'MANUAL_IMPORT' | 'MOCK_PROVIDER';

export interface ProductSourceData {
  platform: ProductSourceType;
  externalId?: string;
  sourceUrl?: string;
  rawPayload?: Record<string, unknown>;
}

export interface ProductMetrics {
  totalSales?: number;
  monthlySales?: number;
  salesVelocity?: number;
  reviewCount: number;
  rating: number; // 0.0 - 5.0
  viewsCount?: number;
  inventoryCount?: number;
}

export interface ProductCommission {
  rate: number; // 0.0 - 1.0 (e.g. 0.18 for 18%)
  amountEstimated: number; // Estimated commission in currency
  commissionType: 'PERCENTAGE' | 'FIXED';
}

export interface ProductCandidate {
  id: string;
  title: string;
  description: string;
  category: string;
  subcategory?: string;
  price: number;
  currency: string;
  originalPrice?: number;
  discountPercentage?: number;
  mainImageUrl: string;
  additionalImages?: string[];
  productUrl?: string;
  source: ProductSourceData;
  metrics: ProductMetrics;
  commission: ProductCommission;
  status: ProductStatus;
  hasAffiliateAvailable: boolean;
  visualHookPotential: 'LOW' | 'MEDIUM' | 'HIGH' | 'VIRAL';
  problemSolved: string;
  targetAudience: string;
  createdAt: string;
  updatedAt: string;
}

export interface ProductHunterQuery {
  category?: string;
  minCommissionRate?: number;
  minPrice?: number;
  maxPrice?: number;
  minRating?: number;
  limit?: number;
  offset?: number;
  source?: ProductSourceType;
}

export interface ProductHunterResult {
  candidates: ProductCandidate[];
  totalFound: number;
  source: ProductSourceType;
  timestamp: string;
}
