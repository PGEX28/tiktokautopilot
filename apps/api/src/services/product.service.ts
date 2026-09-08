import { ProductCandidate, NotFoundError, logger } from '@autopilot/shared';
import { store } from './store.service.js';

export class ProductService {
  async listProducts(filters?: {
    category?: string;
    minPrice?: number;
    maxPrice?: number;
    status?: string;
    limit?: number;
    offset?: number;
  }): Promise<{ products: ProductCandidate[]; total: number }> {
    let items = Array.from(store.products.values());

    if (filters?.category) {
      items = items.filter((p) => p.category.toLowerCase() === filters.category?.toLowerCase());
    }
    if (filters?.status) {
      items = items.filter((p) => p.status === filters.status);
    }
    if (filters?.minPrice !== undefined) {
      items = items.filter((p) => p.price >= (filters.minPrice ?? 0));
    }
    if (filters?.maxPrice !== undefined) {
      items = items.filter((p) => p.price <= (filters.maxPrice ?? Infinity));
    }

    const total = items.length;
    const offset = filters?.offset || 0;
    const limit = filters?.limit || 20;
    const paginated = items.slice(offset, offset + limit);

    return { products: paginated, total };
  }

  async getProductById(id: string): Promise<ProductCandidate> {
    const product = store.products.get(id);
    if (!product) {
      throw new NotFoundError('Product', id);
    }
    return product;
  }

  async updateProductStatus(id: string, status: 'APPROVED' | 'REJECTED', reason?: string): Promise<ProductCandidate> {
    const product = await this.getProductById(id);
    product.status = status;
    product.updatedAt = new Date().toISOString();
    store.products.set(id, product);

    logger.info(`Product status updated to [${status}]`, { productId: id, reason });
    return product;
  }
}

export const productService = new ProductService();
