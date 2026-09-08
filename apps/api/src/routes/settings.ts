import { Router, Request, Response, NextFunction } from 'express';
import { settingsService } from '../services/settings.service.js';
import { UpdateBudgetSettingsSchema } from '../schemas/settings.schema.js';

export const settingsRouter = Router();

// GET /api/v1/settings/budget - Get current budget & autopilot limits
settingsRouter.get('/budget', async (_req: Request, res: Response, next: NextFunction) => {
  try {
    const settings = await settingsService.getBudgetSettings();
    res.json({ success: true, data: settings });
  } catch (error) {
    next(error);
  }
});

// PUT /api/v1/settings/budget - Update budget & autopilot limits
settingsRouter.put('/budget', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const body = UpdateBudgetSettingsSchema.parse(req.body);
    const updated = await settingsService.updateBudgetSettings(body);
    res.json({ success: true, data: updated });
  } catch (error) {
    next(error);
  }
});

// POST /api/v1/settings/emergency-stop - Toggle global emergency stop
settingsRouter.post('/emergency-stop', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { active } = req.body as { active: boolean };
    const updated = await settingsService.setEmergencyStop(!!active);
    res.json({
      success: true,
      message: active ? 'EMERGENCY STOP ATIVADO: Sistema pausado.' : 'EMERGENCY STOP DESATIVADO: Operação normal retomada.',
      data: updated,
    });
  } catch (error) {
    next(error);
  }
});
