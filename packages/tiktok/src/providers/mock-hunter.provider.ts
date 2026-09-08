import { ProductCandidate } from '@autopilot/shared';

export class MockProductHunterProvider {
  private candidateDatabase: ProductCandidate[] = [
    {
      id: 'd0000000-0000-0000-0000-000000000001',
      title: 'Mini Cordless Portable Car & Desk Vacuum 9000Pa',
      description: 'Compact rechargeable handheld vacuum for car crevices, keyboards, and quick dust removal with washable HEPA filter.',
      category: 'Home & Kitchen',
      subcategory: 'Cleaning Tools',
      price: 24.90,
      currency: 'USD',
      originalPrice: 49.90,
      discountPercentage: 50.10,
      mainImageUrl: 'https://images.unsplash.com/photo-1558317374-067fb5f30001?w=800',
      additionalImages: ['https://images.unsplash.com/photo-1558317374-067fb5f30001?w=800'],
      productUrl: 'https://shop.tiktok.com/view/product/tt_prod_vacuum_01',
      source: {
        platform: 'TIKTOK_SHOP_AFFILIATE',
        externalId: 'tt_prod_vacuum_01',
        sourceUrl: 'https://shop.tiktok.com/view/product/tt_prod_vacuum_01',
      },
      metrics: {
        totalSales: 12400,
        monthlySales: 3200,
        salesVelocity: 105,
        reviewCount: 3280,
        rating: 4.7,
      },
      commission: {
        rate: 0.20,
        amountEstimated: 4.98,
        commissionType: 'PERCENTAGE',
      },
      status: 'DISCOVERED',
      hasAffiliateAvailable: true,
      visualHookPotential: 'VIRAL',
      problemSolved: 'Cleans dust, crumbs and hair from hard-to-reach vehicle and workspace crevices instantly without cords.',
      targetAudience: 'Car owners, desk workers, gamers, pet owners',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      id: 'd0000000-0000-0000-0000-000000000002',
      title: 'Magnetic Wireless Fast Power Bank 10000mAh with Foldable Kickstand',
      description: 'Snap-on magnetic power bank with 20W PD fast charging, LED display, and built-in stand for hands-free video watching.',
      category: 'Electronics & Gadgets',
      subcategory: 'Mobile Accessories',
      price: 34.99,
      currency: 'USD',
      originalPrice: 69.99,
      discountPercentage: 50.00,
      mainImageUrl: 'https://images.unsplash.com/photo-1609592807906-8d591873130d?w=800',
      additionalImages: ['https://images.unsplash.com/photo-1609592807906-8d591873130d?w=800'],
      productUrl: 'https://shop.tiktok.com/view/product/tt_prod_powerbank_02',
      source: {
        platform: 'TIKTOK_SHOP_AFFILIATE',
        externalId: 'tt_prod_powerbank_02',
        sourceUrl: 'https://shop.tiktok.com/view/product/tt_prod_powerbank_02',
      },
      metrics: {
        totalSales: 8900,
        monthlySales: 2100,
        salesVelocity: 85,
        reviewCount: 1940,
        rating: 4.6,
      },
      commission: {
        rate: 0.18,
        amountEstimated: 6.30,
        commissionType: 'PERCENTAGE',
      },
      status: 'DISCOVERED',
      hasAffiliateAvailable: true,
      visualHookPotential: 'HIGH',
      problemSolved: 'Eliminates messy tangled cables and charges phone on the go while propping it up for videos.',
      targetAudience: 'Smartphone users, travelers, students, content creators',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      id: 'd0000000-0000-0000-0000-000000000003',
      title: 'Ultrasonic 3D Flame Aromatherapy Essential Oil Diffuser',
      description: 'Realistic flame lighting effect humidifier with 250ml capacity and automatic shut-off safety protection.',
      category: 'Home & Kitchen',
      subcategory: 'Home Decor',
      price: 29.50,
      currency: 'USD',
      originalPrice: 59.00,
      discountPercentage: 50.00,
      mainImageUrl: 'https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?w=800',
      additionalImages: ['https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?w=800'],
      productUrl: 'https://shop.tiktok.com/view/product/tt_prod_diffuser_03',
      source: {
        platform: 'TIKTOK_SHOP_AFFILIATE',
        externalId: 'tt_prod_diffuser_03',
        sourceUrl: 'https://shop.tiktok.com/view/product/tt_prod_diffuser_03',
      },
      metrics: {
        totalSales: 15600,
        monthlySales: 4300,
        salesVelocity: 140,
        reviewCount: 4120,
        rating: 4.8,
      },
      commission: {
        rate: 0.22,
        amountEstimated: 6.49,
        commissionType: 'PERCENTAGE',
      },
      status: 'DISCOVERED',
      hasAffiliateAvailable: true,
      visualHookPotential: 'VIRAL',
      problemSolved: 'Transforms room atmosphere with mesmerizing flame visual while humidifying dry air and diffusing pleasant scents.',
      targetAudience: 'Home lovers, wellness enthusiasts, gamers, bedroom decorators',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      id: 'd0000000-0000-0000-0000-000000000004',
      title: 'Electric Heated Eyelash Curler with Long Lasting Natural Curl',
      description: 'Rechargeable thermal curler with 2 temperature modes that creates all-day curls in 10 seconds without pinching.',
      category: 'Beauty & Personal Care',
      subcategory: 'Makeup Tools',
      price: 18.99,
      currency: 'USD',
      originalPrice: 38.00,
      discountPercentage: 50.03,
      mainImageUrl: 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=800',
      additionalImages: ['https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=800'],
      productUrl: 'https://shop.tiktok.com/view/product/tt_prod_curler_04',
      source: {
        platform: 'TIKTOK_SHOP_AFFILIATE',
        externalId: 'tt_prod_curler_04',
        sourceUrl: 'https://shop.tiktok.com/view/product/tt_prod_curler_04',
      },
      metrics: {
        totalSales: 22000,
        monthlySales: 5100,
        salesVelocity: 180,
        reviewCount: 5600,
        rating: 4.7,
      },
      commission: {
        rate: 0.25,
        amountEstimated: 4.75,
        commissionType: 'PERCENTAGE',
      },
      status: 'DISCOVERED',
      hasAffiliateAvailable: true,
      visualHookPotential: 'VIRAL',
      problemSolved: 'Replaces painful manual eyelash curlers and delivers dramatic lift in seconds.',
      targetAudience: 'Makeup enthusiasts, beauty creators, daily commuters',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
  ];

  async getCandidates(filters?: {
    category?: string;
    minCommissionRate?: number;
    minPrice?: number;
    maxPrice?: number;
    minRating?: number;
    limit?: number;
  }): Promise<ProductCandidate[]> {
    let results = [...this.candidateDatabase];

    if (filters?.category) {
      results = results.filter(
        (p) => p.category.toLowerCase() === filters.category?.toLowerCase()
      );
    }
    if (filters?.minCommissionRate !== undefined) {
      results = results.filter((p) => p.commission.rate >= (filters.minCommissionRate ?? 0));
    }
    if (filters?.minPrice !== undefined) {
      results = results.filter((p) => p.price >= (filters.minPrice ?? 0));
    }
    if (filters?.maxPrice !== undefined) {
      results = results.filter((p) => p.price <= (filters.maxPrice ?? Infinity));
    }
    if (filters?.minRating !== undefined) {
      results = results.filter((p) => p.metrics.rating >= (filters.minRating ?? 0));
    }

    const limit = filters?.limit || 20;
    return results.slice(0, limit);
  }
}

export const mockProductHunterProvider = new MockProductHunterProvider();
