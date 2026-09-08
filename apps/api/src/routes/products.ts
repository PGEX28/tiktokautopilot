import { Router, Request, Response, NextFunction } from 'express';
import { productService } from '../services/product.service.js';
import { ProductQuerySchema, ProductActionSchema } from '../schemas/product.schema.js';

export const productsRouter = Router();

// GET /api/v1/products - List products with optional filters
productsRouter.get('/', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const query = ProductQuerySchema.parse(req.query);
    const result = await productService.listProducts(query);
    res.json({ success: true, data: result.products, total: result.total });
  } catch (error) {
    next(error);
  }
});

// GET /api/v1/products/:id - Get single product
productsRouter.get('/:id', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const product = await productService.getProductById(req.params.id as string);
    res.json({ success: true, data: product });
  } catch (error) {
    next(error);
  }
});

// POST /api/v1/products/:id/action - Approve or Reject product
productsRouter.post('/:id/action', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const body = ProductActionSchema.parse(req.body);
    const updated = await productService.updateProductStatus(
      req.params.id as string,
      body.action === 'APPROVE' ? 'APPROVED' : 'REJECTED',
      body.reason
    );
    res.json({ success: true, data: updated });
  } catch (error) {
    next(error);
  }
});
