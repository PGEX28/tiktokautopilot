import { BudgetSettings, logger } from '@autopilot/shared';
import { store } from './store.service.js';

export class SettingsService {
  async getBudgetSettings(): Promise<BudgetSettings> {
    return store.budgetSettings;
  }

  async updateBudgetSettings(updates: Partial<BudgetSettings>): Promise<BudgetSettings> {
    store.budgetSettings = {
      ...store.budgetSettings,
      ...updates,
      updatedAt: new Date().toISOString(),
    };
    logger.info('Updated budget & autopilot settings', { updates });
    return store.budgetSettings;
  }

  async setEmergencyStop(active: boolean): Promise<BudgetSettings> {
    store.budgetSettings.emergencyStop = active;
    store.budgetSettings.updatedAt = new Date().toISOString();
    logger.warn(`EMERGENCY STOP state changed to: ${active ? 'ACTIVE (SYSTEM PAUSED)' : 'INACTIVE (NORMAL)'}`);
    return store.budgetSettings;
  }
}

export const settingsService = new SettingsService();
